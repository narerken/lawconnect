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
  UserOutlined,
  QuestionCircleOutlined,
  TeamOutlined,
  MessageOutlined,
  HomeOutlined
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
        gap: '30px'
      }}
    >
      <div style={{ marginRight: '24px' }}>
        <Link to="/">
          <Text strong style={{ color: '#fff', fontSize: '18px' }}>
            LawConnect
          </Text>
        </Link>
      </div>
      <Dropdown overlay={userMenu} placement="bottomRight">
        <Space 
          style={{ 
            cursor: 'pointer',
            padding: '0 12px',
            marginRight: '20px',
            transition: 'all 0.3s',
            ':hover': {
              background: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <Badge dot={user.role === 'lawyer' && user.newAnswers > 0}>
            <Avatar 
              icon={<UserOutlined />} 
              src={user.avatar}
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