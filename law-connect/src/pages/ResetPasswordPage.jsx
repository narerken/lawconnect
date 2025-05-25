import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Space // Добавляем Space для горизонтального расположения
} from 'antd';
import { LockOutlined, LoginOutlined } from '@ant-design/icons';
import axios from '../api/axios';

const { Title, Text } = Typography;

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`/auth/reset-password/${token}`, { password });
      setMsg('Пароль успешно изменён. Перенаправление...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Ошибка сброса пароля');
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
              <LockOutlined style={{ marginRight: 8 }} />
              Сброс пароля
            </Title>
          }
          style={{ borderRadius: 8, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
        >
          {msg && (
            <Alert
              message={
                <Space> {/* Обернули сообщение в Space для горизонтального расположения */}
                  {msg.includes('успешно') ? (
                    <>
                      <span>{msg}</span>
                      <LoginOutlined spin />
                    </>
                  ) : (
                    <span>{msg}</span>
                  )}
                </Space>
              }
              type={msg.includes('успешно') ? 'success' : 'error'}
              showIcon
              closable
              style={{ marginBottom: 24 }}
              onClose={() => setMsg('')}
            />
          )}

          <Form layout="vertical" onSubmitCapture={handleSubmit}>
            <Form.Item
              label="Новый пароль"
              name="password"
              rules={[
                { required: true, message: 'Пожалуйста, введите новый пароль!' },
                { min: 6, message: 'Пароль должен содержать минимум 6 символов' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Введите новый пароль"
                size="large"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block
                loading={loading}
                size="large"
                icon={<LockOutlined />}
              >
                Установить новый пароль
              </Button>
            </Form.Item>

            <Divider>Вспомнили пароль?</Divider>

            <div style={{ textAlign: 'center' }}>
              <Text>
                <a href="/login">Войти в аккаунт</a>
              </Text>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}