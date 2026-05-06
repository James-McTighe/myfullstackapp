import io
import base64
import matplotlib.pyplot as plt
from flask import jsonify, Blueprint

graphs = Blueprint('graphs', __name__)

@graphs.route('/api/test-graph')
def get_graph():
    # 1. Create the plot
    plt.figure(figsize=(6, 4))
    plt.plot([1, 2, 3, 4], [100, 20, 25, 30], marker='o', color='#4f46e5')
    plt.title("Sample Analytical Data")
    plt.xlabel("X Axis")
    plt.ylabel("Y Axis")

    # 2. Save the plot to a memory buffer
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    
    # 3. Encode the buffer to Base64
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close() # Always close the plot to free memory

    return jsonify({
        "image": img_base64,
        "title": "Molecular Analysis Chart"
    })
