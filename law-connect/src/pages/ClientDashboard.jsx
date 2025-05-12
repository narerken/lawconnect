import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    axios.get(`/questions/client/${user.id}`).then(res => setQuestions(res.data));
  }, [user.id]);

  const markBest = async (questionId, index) => {
    await axios.post(`/questions/mark-best/${questionId}/${index}`);
    location.reload();
  };

  return (
    <div>
      <LogoutButton />
      <h2>Привет, {user.username}</h2>
      <Link to="/ask">✍️ Задать вопрос</Link> | <Link to="/lawyers">👨‍⚖️ Найти юриста</Link>

      <h3>Ваши вопросы:</h3>
      {questions.map(q => (
        <div key={q._id} style={{ marginBottom: 10 }}>
          <p><b>Вопрос:</b> {q.text}</p>
          <ul>
            {q.answers.map((a, i) => (
              <li key={i}>
                {a.text} — {a.lawyerId?.username}
                {a.isBest ? ' ✅ Лучший' : (
                  <button onClick={() => markBest(q._id, i)}>Выбрать как лучший</button>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ClientDashboard;
