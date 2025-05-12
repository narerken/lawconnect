import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

const LawyerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get(`/bookings/${user.id}`).then(res => setBookings(res.data));
  }, [user.id]);

  return (
    <div>
      <h2>Добро пожаловать, {user.username}</h2>
      <p>Рейтинг: {user.points}</p>
      <Link to="/answer">📬 Ответить на вопросы</Link>

      <h3>Ваши записи:</h3>
      {bookings.map(b => (
        <div key={b._id}>
          <p>{b.clientId?.username} — {new Date(b.date).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default LawyerDashboard;
