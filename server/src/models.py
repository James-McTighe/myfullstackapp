from src import db

class JobApplication(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String, nullable=False)
