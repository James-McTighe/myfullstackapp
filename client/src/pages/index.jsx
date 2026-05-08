import { useState, useEffect } from 'react';
import axios from 'axios';
import InfoCard from '../components/InfoCard';

const Home = () => {
  const [cardData, setCardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/data');
        const payload = Array.isArray(response.data)
          ? response.data
          : response.data
            ? [response.data]
            : [];

        setCardData(payload);
        setError('');
      } catch (error) {
        console.error("Error fetching data from Flask:", error);
        setError('Unable to load dashboard data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12 lg:px-20">
      <header className="mb-12 max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          System Dashboard
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Things you can do with this app
        </p>
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <h1>Trying to get data...</h1>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {cardData.map((card, index) => (
            <InfoCard 
              key={card.id || index}
              id={card.id || index}
              title={card.title}
              category={card.category}
              description={card.description}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
