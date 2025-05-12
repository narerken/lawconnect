import { useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AskQuestionPage = () => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/questions/ask', { clientId: user.id, text });
    navigate('/client-dashboard');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Задать вопрос</h2>
      <textarea value={text} onChange={(e) => setText(e.target.value)} required />
      <br />
      <button type="submit">Отправить</button>
    </form>
  );
};

export default AskQuestionPage;
