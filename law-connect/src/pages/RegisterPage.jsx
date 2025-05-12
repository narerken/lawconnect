import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [form, setForm] = useState({ email: '', username: '', password: '', role: 'client' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/auth/register', form);
    navigate('/login');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Регистрация</h2>
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="username" placeholder="Username" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Пароль" onChange={handleChange} required />
      <select name="role" onChange={handleChange}>
        <option value="client">Клиент</option>
        <option value="lawyer">Юрист</option>
      </select>
      <button type="submit">Зарегистрироваться</button>
    </form>
  );
};

export default RegisterPage;
