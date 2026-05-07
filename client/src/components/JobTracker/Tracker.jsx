import React from 'react';
import InfoCard from '../InfoCard';
import axios from 'axios';
import AddJob from './AddJob.jsx';

const Tracker = () => {
  function search(formData) {
    const query = formData.get("query");
    alert(`Submission succesful!`);
  }
  return (
    <div>
      <AddJob />
      <form action={search}>
      <input className="bg-slate-300 border-2 m-2" name='query' />
        <button type='submit' className='b'>Search</button>
      </form>
    </div>
  )
}

export default Tracker;
