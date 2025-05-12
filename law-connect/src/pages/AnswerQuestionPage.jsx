import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';

const AnswerQuestionPage = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    axios.get('/questions/all').then(res => {
      const unanswered = res.data.filter(q =>
        !q.answers.some(a => a.lawyerId?._id === user.id)
      );
      setQuestions(unanswered);
    });
  }, [user.id]);

  const handleSubmit = async (qId) => {
    const text = answers[qId];
    await axios.post('/questions/answer', { questionId: qId, lawyerId: user.id, text });
    location.reload();
  };

  return (
    <div>
      <h2>Ответы на вопросы</h2>
      {questions.map(q => (
        <div key={q._id}>
          <p><b>{q.text}</b></p>
          <textarea onChange={e => setAnswers({ ...answers, [q._id]: e.target.value })} />
          <button onClick={() => handleSubmit(q._id)}>Ответить</button>
        </div>
      ))}
    </div>
  );
};

export default AnswerQuestionPage;
