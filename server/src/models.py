from datetime import date, datetime

from src import db


class JobApplication(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    job_title = db.Column(db.String(160), nullable=False)
    company_name = db.Column(db.String(160), nullable=False)
    status = db.Column(db.String(40), nullable=False, default="Applied")
    location = db.Column(db.String(120), nullable=True)
    job_url = db.Column(db.String(500), nullable=True)
    salary = db.Column(db.Integer, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    next_step = db.Column(db.String(255), nullable=True)
    date_applied = db.Column(db.Date, nullable=False, default=date.today)
    archived = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def to_dict(self):
        return {
            "id": self.id,
            "jobTitle": self.job_title,
            "companyName": self.company_name,
            "status": self.status,
            "location": self.location or "",
            "jobUrl": self.job_url or "",
            "salary": self.salary,
            "notes": self.notes or "",
            "nextStep": self.next_step or "",
            "dateApplied": self.date_applied.isoformat() if self.date_applied else None,
            "archived": self.archived,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }
