import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

const LawyerListPage = () => {
  const [lawyers, setLawyers] = useState([]);

  useEffect(() => {
    axios.get('/questions/all').then(res => {
      const users = res.data
        .map(q => q.answers.map(a => a.lawyerId))
        .flat()
        .filter(Boolean);

      const unique = {};
      users.forEach(u => {
        if (!unique[u._id]) unique[u._id] = { ...u, points: u.points || 0 };
        else unique[u._id].points += 0;
      });

      const sorted = Object.values(unique).sort((a, b) => b.points - a.points);
      setLawyers(sorted);
    });
  }, []);

  return (
    <div>
      <h2>Юристы по рейтингу</h2>
      {lawyers.map(l => (
        <div key={l._id}>
          <p>{l.username} — Баллы: {l.points}</p>
          <Link to={`/book/${l._id}`}>Записаться</Link>
        </div>
      ))}
    </div>
  );
};

export default LawyerListPage;
