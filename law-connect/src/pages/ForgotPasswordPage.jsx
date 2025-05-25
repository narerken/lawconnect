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
  Space
} from 'antd';
import { MailOutlined, ArrowRightOutlined } from '@ant-design/icons';
import axios from '../api/axios';

const { Title, Text } = Typography;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Произошла ошибка. Пожалуйста, попробуйте позже.');
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
              <MailOutlined style={{ marginRight: 8 }} />
              Восстановление пароля
            </Title>
          }
          style={{ borderRadius: 8, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
        >
          {msg && (
            <Alert
              message={
                <Space align="center">
                  {msg}
                  {!msg.includes('Ошибка') && <ArrowRightOutlined spin />}
                </Space>
              }
              type={msg.includes('Ошибка') ? 'error' : 'success'}
              showIcon
              closable
              style={{ marginBottom: 24, display: 'flex', alignItems: 'center' }}
              onClose={() => setMsg('')}
            />
          )}

          <Form layout="vertical" onSubmitCapture={handleSubmit}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { 
                  required: true, 
                  message: 'Пожалуйста, введите ваш email!' 
                },
                { 
                  type: 'email', 
                  message: 'Пожалуйста, введите корректный email!' 
                }
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="example@domain.com"
                size="large"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block
                loading={loading}
                size="large"
                icon={<MailOutlined />}
              >
                Отправить инструкции
              </Button>
            </Form.Item>

            <Divider orientation="center">Вспомнили пароль?</Divider>

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