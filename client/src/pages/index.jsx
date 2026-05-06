import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfoCard from '../components/InfoCard';

const Home = () => {
  const [cardData, setCardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/data');
        setCardData(response.data);
      } catch (error) {
        console.error("Error fetching data from Flask:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12 lg:px-20">
      <header className="mb-12 max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          System Dashboard
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Real-time data retrieved from the Flask backend.
        </p>
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <main className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cardData.map((card, index) => (
            <InfoCard 
              id={card.id || index}
              title={card.title}
              category={card.category}
              description={card.description}
            />
          ))}
        </main>
      )}
    </div>
  );
};

export default Home;
