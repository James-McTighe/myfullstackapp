from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_mail import Mail
from sqlalchemy import inspect, text
from src.config import Config
from flask_cors import CORS

db = SQLAlchemy()
bcrypt = Bcrypt()
login_manager = LoginManager()
login_manager.login_view = 'users.login'
login_manager.login_message_category = 'info'
mail = Mail()


def ensure_job_application_schema():
    inspector = inspect(db.engine)
    table_names = inspector.get_table_names()

    if "job_application" not in table_names:
        return

    existing_columns = {column["name"] for column in inspector.get_columns("job_application")}
    column_updates = {
        "job_title": "ALTER TABLE job_application ADD COLUMN job_title VARCHAR(160) DEFAULT ''",
        "status": "ALTER TABLE job_application ADD COLUMN status VARCHAR(40) DEFAULT 'Applied'",
        "location": "ALTER TABLE job_application ADD COLUMN location VARCHAR(120)",
        "job_url": "ALTER TABLE job_application ADD COLUMN job_url VARCHAR(500)",
        "salary": "ALTER TABLE job_application ADD COLUMN salary INTEGER",
        "notes": "ALTER TABLE job_application ADD COLUMN notes TEXT",
        "next_step": "ALTER TABLE job_application ADD COLUMN next_step VARCHAR(255)",
        "date_applied": "ALTER TABLE job_application ADD COLUMN date_applied DATE",
        "archived": "ALTER TABLE job_application ADD COLUMN archived BOOLEAN DEFAULT 0",
        "created_at": "ALTER TABLE job_application ADD COLUMN created_at DATETIME",
        "updated_at": "ALTER TABLE job_application ADD COLUMN updated_at DATETIME",
    }

    for column_name, statement in column_updates.items():
        if column_name not in existing_columns:
            db.session.execute(text(statement))

    db.session.execute(
        text(
            """
            UPDATE job_application
            SET
                job_title = COALESCE(NULLIF(job_title, ''), 'Untitled Role'),
                status = COALESCE(status, 'Applied'),
                archived = COALESCE(archived, 0),
                date_applied = COALESCE(date_applied, DATE('now')),
                created_at = COALESCE(created_at, CURRENT_TIMESTAMP),
                updated_at = COALESCE(updated_at, CURRENT_TIMESTAMP)
            """
        )
    )
    db.session.commit()


def create_app(config_class=Config):
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(config_class)
    
    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    mail.init_app(app)

    from src import models

    with app.app_context():
        db.create_all()
        ensure_job_application_schema()

    from src.home.routes import main
    from src.graphs.graphs import graphs
    from src.job_apps.routes import job_apps

    app.register_blueprint(main)
    app.register_blueprint(graphs)
    app.register_blueprint(job_apps)

    return app
