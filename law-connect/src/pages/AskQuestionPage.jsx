import { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Typography, 
  Card, 
  Row, 
  Col,
  message
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const { Title } = Typography;
const { TextArea } = Input;

const AskQuestionPage = () => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await axios.post('/questions/ask', { 
        clientId: user.id, 
        text: values.question 
      });
      message.success('Вопрос успешно отправлен!');
      navigate('/client-dashboard');
    } catch (error) {
      message.error('Ошибка при отправке вопроса');
      console.error('Error asking question:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f0f2f5',
    }}>
      <Header />
      
      <Row justify="center" style={{ paddingTop: 150  }}>
        <Col xs={24} sm={20} md={16} lg={12}>
          <Card
            title={
              <Title level={3} style={{ marginBottom: 0 }}>
                <QuestionCircleOutlined style={{ marginRight: '8px' }} />
                Задать вопрос
              </Title>
            }
            style={{ borderRadius: '8px' }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Form.Item
                name="question"
                label="Ваш вопрос"
                rules={[
                  { required: true, message: 'Пожалуйста, введите ваш вопрос' },
                  { min: 10, message: 'Вопрос должен содержать минимум 10 символов' }
                ]}
              >
                <TextArea 
                  rows={6} 
                  placeholder="Опишите вашу проблему подробно..." 
                  maxLength={1000}
                  showCount
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  size="large"
                  block
                >
                  Отправить вопрос
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AskQuestionPage;