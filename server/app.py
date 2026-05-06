from flask import Flask, jsonify
from src import create_app

app = create_app()

@app.route('/api/data', methods=['GET'])
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

if __name__ == '__main__':

    app.run(host='0.0.0.0', port=5000, debug=True)
