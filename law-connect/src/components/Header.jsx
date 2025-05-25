import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Layout, 
  Menu, 
  Dropdown, 
  Avatar, 
  Typography, 
  Space,
  Badge
} from 'antd';
import { 
  LogoutOutlined,
  UserOutlined
} from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">
          <UserOutlined /> Профиль
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={logout}>
        <LogoutOutlined /> Выйти
      </Menu.Item>
    </Menu>
  );

  const avatarUrl = user.avatar
    ? `http://localhost:5000${user.avatar}`
    : null;

  return (
    <AntHeader 
      style={{ 
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        background: '#001529',
        position: 'fixed',
        zIndex: 100,
        width: '100%',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        gap: '20px'
      }}
    >
      {/* Логотип */}
      <Link to="/">
        <Text strong style={{ color: '#fff', fontSize: '18px' }}>
          LawConnect
        </Text>
      </Link>

      {/* Блок: аватар + имя */}
      <Dropdown overlay={userMenu} placement="bottomLeft">
        <Space 
          style={{ 
            cursor: 'pointer',
            padding: '0 12px',
            borderRadius: 4,
            transition: 'all 0.3s'
          }}
        >
          <Badge dot={user.role === 'lawyer' && user.newAnswers > 0}>
            <Avatar 
              icon={!avatarUrl && <UserOutlined />}
              src={avatarUrl}
              style={{ backgroundColor: '#1890ff' }}
            />
          </Badge>
          <Text style={{ color: '#fff' }}>
            {user.username} ({user.role === 'client' ? 'Клиент' : 'Юрист'})
          </Text>
        </Space>
      </Dropdown>
    </AntHeader>
  );
};

export default Header;
