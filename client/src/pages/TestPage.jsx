import { useState, useEffect } from 'react';
import axios from 'axios';

const TestPage = () => {
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/test-graph')
      .then(res => {
        setGraphData(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [])
  if (loading) return <p className="p-6">Loading Visualization...</p>;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-slate-800">{graphData.title}</h3>
      <div className="flex justify-center">
        {/* Render the Base64 string inside the src attribute */}
        <img
          src={`data:image/png;base64,${graphData.image}`}
          alt="Matplotlib Graph"
          className="rounded-lg max-w-full h-auto"
        />
      </div>
    </div>
  );
};

export default TestPage;
