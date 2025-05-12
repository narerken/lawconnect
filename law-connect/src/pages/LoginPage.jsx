import { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Alert,
  Row,
  Col,
  Divider,
  Checkbox 
} from 'antd';
import { 
  MailOutlined, 
  LockOutlined,
  LoginOutlined 
} from '@ant-design/icons';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const { Title, Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post('/auth/login', values);
      login(res.data.user);
      navigate(res.data.user.role === 'client' ? '/client-dashboard' : '/lawyer-dashboard', {
        state: { success: 'Вы успешно вошли в систему!' }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка входа. Проверьте email и пароль.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Col xs={24} sm={20} md={16} lg={12} xl={10}>
        <Card 
          title={
            <Title level={3} style={{ textAlign: 'center', marginBottom: 0 }}>
              <LoginOutlined style={{ marginRight: 8 }} />
              Вход в систему
            </Title>
          }
          style={{ borderRadius: 8, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
        >
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              style={{ marginBottom: 24 }}
              onClose={() => setError(null)}
            />
          )}

          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Пожалуйста, введите ваш email!' },
                { type: 'email', message: 'Неверный формат email' }
              ]}
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="example@domain.com" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Пароль"
              rules={[
                { required: true, message: 'Пожалуйста, введите пароль!' }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Введите пароль" 
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Запомнить меня</Checkbox>
              </Form.Item>
              <Link to="/forgot-password" style={{ float: 'right' }}>
                Забыли пароль?
              </Link>
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block
                loading={loading}
                size="large"
                icon={<LoginOutlined />}
              >
                Войти
              </Button>
            </Form.Item>

            <Divider>Еще не зарегистрированы?</Divider>

            <div style={{ textAlign: 'center' }}>
              <Text>
                Создайте аккаунт <Link to="/register">Регистрация</Link>
              </Text>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginPage;