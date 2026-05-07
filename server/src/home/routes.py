from flask import render_template, request, Blueprint, jsonify
import json
from pathlib import Path

main = Blueprint("main", __name__)

HOME_CONTENT_PATH = Path(__file__).with_name("home-content.json")


@main.route("/")
@main.route("/home")
def home():
    pass


@main.route("/api/data", methods=["GET"])
def get_data():
    with HOME_CONTENT_PATH.open("r", encoding="utf-8") as file:
        data = json.load(file)
    return jsonify(data)


@main.route("/about")
def about():
    pass
