import { useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/auth/login', form);
            login(res.data.user);
            navigate(res.data.user.role === 'client' ? '/client-dashboard' : '/lawyer-dashboard');
        } catch (err) {
            alert(err.response?.data?.message || 'Ошибка входа');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Вход</h2>
            <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} required />
            <input placeholder="Пароль" type="password" onChange={e => setForm({ ...form, password: e.target.value })} required />
            <button type="submit">Войти</button>
        </form>
    );
};

export default LoginPage;
