import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const BookConsultationPage = () => {
  const { user } = useAuth();
  const { lawyerId } = useParams();
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/bookings', { clientId: user.id, lawyerId, date });
    navigate('/client-dashboard');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Записаться на консультацию</h2>
      <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required />
      <button type="submit">Записаться</button>
    </form>
  );
};

export default BookConsultationPage;
