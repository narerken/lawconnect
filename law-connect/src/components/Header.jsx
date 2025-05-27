import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import {
  Layout,
  Menu,
  Dropdown,
  Avatar,
  Typography,
  Space,
  Badge,
  Button
} from 'antd';
import {
  LogoutOutlined,
  UserOutlined,
  GlobalOutlined,
  BulbOutlined
} from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  if (!user) return null;

  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">
          <UserOutlined /> {t('profile')}
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={logout}>
        <LogoutOutlined /> {t('logout')}
      </Menu.Item>
    </Menu>
  );

  const languageMenu = (
    <Menu>
      <Menu.Item key="ru" onClick={() => i18n.changeLanguage('ru')}>
        🇷🇺 Русский
      </Menu.Item>
      <Menu.Item key="en" onClick={() => i18n.changeLanguage('en')}>
        🇺🇸 English
      </Menu.Item>
    </Menu>
  );

  const avatarUrl = user.avatar ? `http://localhost:5000${user.avatar}` : null;

  return (
    <AntHeader
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        background: theme === 'light' ? '#fff' : '#001529',
        position: 'fixed',
        zIndex: 100,
        width: '100%',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        borderBottom: theme === 'light' ? '1px solid #f0f0f0' : 'none'
      }}
    >
      {/* ВСЁ выровнено влево */}
      <Space size="large" align="center">
        {/* Логотип */}
        <Link to="/">
          <Text strong style={{ color: theme === 'light' ? '#001529' : '#fff', fontSize: '18px' }}>
            {t('appName')}
          </Text>
        </Link>

        {/* Имя пользователя и аватар */}
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
                style={{ backgroundColor: theme === 'light' ? '#1890ff' : '#096dd9' }}
              />
            </Badge>
            <Text style={{ color: theme === 'light' ? '#001529' : '#fff' }}>
              {user.username} ({t(user.role)})
            </Text>
          </Space>
        </Dropdown>

        {/* Кнопка темы */}
        <Button
          icon={<BulbOutlined />}
          onClick={toggleTheme}
          type="text"
          style={{ color: theme === 'light' ? '#001529' : '#fff' }}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </Button>

        {/* Кнопка языка */}
        <Dropdown overlay={languageMenu} placement="bottomLeft">
          <Button
            type="text"
            icon={<GlobalOutlined />}
            style={{ color: theme === 'light' ? '#001529' : '#fff' }}
          />
        </Dropdown>
      </Space>

      {/* ПРАВАЯ ЧАСТЬ — пуста, но используется для правильного отступа */}
      <div />
    </AntHeader>
  );
};

export default Header;
