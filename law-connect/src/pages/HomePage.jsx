import { Link } from 'react-router-dom';

const HomePage = () => (
  <div>
    <h1>LawConnect</h1>
    <p>Платформа для клиентов и юристов</p>
    <Link to="/login">Войти</Link> | <Link to="/register">Регистрация</Link>
  </div>
);

export default HomePage;
