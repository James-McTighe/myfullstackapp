from flask import Blueprint, jsonify
from pathlib import Path
from src import db

job_apps = Blueprint("job_apps", __name__)

@job_apps.route("/api/data/job_apps", methods=["GET"])
def get_job_data():
    pass
