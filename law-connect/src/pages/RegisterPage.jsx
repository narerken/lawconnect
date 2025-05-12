import { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Select, 
  Card, 
  Typography, 
  Alert,
  Row,
  Col,
  Divider 
} from 'antd';
import { 
  MailOutlined, 
  UserOutlined, 
  LockOutlined,
  SolutionOutlined
} from '@ant-design/icons';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      setError(null);
      await axios.post('/auth/register', values);
      navigate('/login', { state: { success: 'Регистрация прошла успешно! Теперь вы можете войти.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
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
              <SolutionOutlined style={{ marginRight: 8 }} />
              Регистрация
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
            form={form}
            name="register"
            onFinish={onFinish}
            scrollToFirstError
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
              />
            </Form.Item>

            <Form.Item
              name="username"
              label="Имя пользователя"
              rules={[
                { required: true, message: 'Пожалуйста, введите имя пользователя!' },
                { min: 3, message: 'Минимум 3 символа' },
                { max: 20, message: 'Максимум 20 символов' }
              ]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Ваше имя" 
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Пароль"
              rules={[
                { required: true, message: 'Пожалуйста, введите пароль!' },
                { min: 6, message: 'Минимум 6 символов' }
              ]}
              hasFeedback
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Не менее 6 символов" 
              />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Подтвердите пароль"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: 'Пожалуйста, подтвердите пароль!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Пароли не совпадают!'));
                  },
                }),
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Повторите пароль" 
              />
            </Form.Item>

            <Form.Item
              name="role"
              label="Вы регистрируетесь как"
              initialValue="client"
            >
              <Select>
                <Option value="client">Клиент</Option>
                <Option value="lawyer">Юрист</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block
                loading={loading}
                size="large"
              >
                Зарегистрироваться
              </Button>
            </Form.Item>

            <Divider>Уже есть аккаунт?</Divider>

            <div style={{ textAlign: 'center' }}>
              <Text>
                <Link to="/login">Войти в систему</Link>
              </Text>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default RegisterPage;