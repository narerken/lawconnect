import { useAuth } from '../context/AuthContext';

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <button onClick={logout} style={{ float: 'right' }}>
      🚪 Выйти
    </button>
  );
};

export default LogoutButton;
