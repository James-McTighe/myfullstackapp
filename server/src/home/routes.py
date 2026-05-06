from flask import render_template, request, Blueprint, jsonify

main = Blueprint('main', __name__)

@main.route("/")
@main.route("/home")
def home():
    pass

@main.route('/api/data', methods=['GET'])
def get_data():
    # Ensure keys match the props expected by your React InfoCard
    data = [
        {
            "id": 1,
            "title": "Method Validation",
            "category": "R&D",
            "description": "Streamlining pharmaceutical workflows with automated data verification."
        },
        {
            "id": 2,
            "title": "Computational Models",
            "category": "Software",
            "description": "High-performance simulation of molecular dynamics and interactions."
        }
    ]
    return jsonify(data)

@main.route("/about")
def about():
    pass
