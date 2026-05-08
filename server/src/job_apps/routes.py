from datetime import date, datetime

from flask import Blueprint, jsonify, request
from sqlalchemy import or_

from src import db
from src.models import JobApplication

job_apps = Blueprint("job_apps", __name__)

VALID_STATUSES = {
    "Applied",
    "Phone Screen",
    "Interviewing",
    "Offer",
    "Rejected",
    "Withdrawn",
}


def _parse_date(value):
    if not value:
        return date.today()

    try:
        return datetime.strptime(value, "%Y-%m-%d").date()
    except ValueError as exc:
        raise ValueError("dateApplied must use YYYY-MM-DD format.") from exc


def _parse_payload(payload, existing_job=None):
    job_title = (payload.get("jobTitle") or "").strip()
    company_name = (payload.get("companyName") or "").strip()
    status = (payload.get("status") or "Applied").strip() or "Applied"
    location = (payload.get("location") or "").strip() or None
    job_url = (payload.get("jobUrl") or "").strip() or None
    notes = (payload.get("notes") or "").strip() or None
    next_step = (payload.get("nextStep") or "").strip() or None

    if not job_title:
        raise ValueError("jobTitle is required.")
    if not company_name:
        raise ValueError("companyName is required.")
    if status not in VALID_STATUSES:
        raise ValueError("status is invalid.")

    salary_raw = payload.get("salary")
    salary = None
    if salary_raw not in (None, ""):
        try:
            salary = int(salary_raw)
        except (TypeError, ValueError) as exc:
            raise ValueError("salary must be a whole number.") from exc

    parsed = {
        "job_title": job_title,
        "company_name": company_name,
        "status": status,
        "location": location,
        "job_url": job_url,
        "salary": salary,
        "notes": notes,
        "next_step": next_step,
        "date_applied": _parse_date(payload.get("dateApplied")),
    }

    if existing_job is not None and "archived" in payload:
        parsed["archived"] = bool(payload.get("archived"))

    return parsed


@job_apps.route("/api/job-apps", methods=["GET"])
def get_job_data():
    status = request.args.get("status", "").strip()
    query = request.args.get("query", "").strip()
    include_archived = request.args.get("includeArchived", "false").lower() == "true"

    jobs_query = JobApplication.query

    if status:
        jobs_query = jobs_query.filter(JobApplication.status == status)

    if query:
        like_term = f"%{query}%"
        jobs_query = jobs_query.filter(
            or_(
                JobApplication.job_title.ilike(like_term),
                JobApplication.company_name.ilike(like_term),
                JobApplication.location.ilike(like_term),
                JobApplication.notes.ilike(like_term),
                JobApplication.next_step.ilike(like_term),
            )
        )

    if not include_archived:
        jobs_query = jobs_query.filter(JobApplication.archived.is_(False))

    jobs = jobs_query.order_by(
        JobApplication.date_applied.desc(), JobApplication.updated_at.desc()
    ).all()

    return jsonify({"items": [job.to_dict() for job in jobs], "count": len(jobs)})


@job_apps.route("/api/job-apps", methods=["POST"])
def add_job():
    payload = request.get_json(silent=True) or {}

    try:
        job = JobApplication(**_parse_payload(payload))
        db.session.add(job)
        db.session.commit()
    except ValueError as exc:
        db.session.rollback()
        return jsonify({"error": str(exc)}), 400

    return jsonify(job.to_dict()), 201


@job_apps.route("/api/job-apps/<int:job_id>", methods=["PUT"])
def update_job(job_id):
    job = JobApplication.query.get_or_404(job_id)
    payload = request.get_json(silent=True) or {}

    try:
        parsed_payload = _parse_payload(payload, existing_job=job)
        for field, value in parsed_payload.items():
            setattr(job, field, value)
        db.session.commit()
    except ValueError as exc:
        db.session.rollback()
        return jsonify({"error": str(exc)}), 400

    return jsonify(job.to_dict())


@job_apps.route("/api/job-apps/<int:job_id>/archive", methods=["PATCH"])
def archive_job(job_id):
    job = JobApplication.query.get_or_404(job_id)
    payload = request.get_json(silent=True) or {}
    archived = payload.get("archived")

    if archived is None:
        archived = True

    job.archived = bool(archived)
    db.session.commit()

    return jsonify(job.to_dict())
