import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Form, 
  DatePicker, 
  Button, 
  Card, 
  Typography, 
  Row, 
  Col,
  message,
  TimePicker,
  Avatar,
  Descriptions
} from 'antd';
import { 
  CalendarOutlined,
  UserOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const BookConsultationPage = () => {
  const { user } = useAuth();
  const { lawyerId } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [lawyerData, setLawyerData] = useState(null);
  const navigate = useNavigate();

  // В реальном приложении нужно загрузить данные юриста по lawyerId
  // useEffect(() => {
  //   axios.get(`/lawyers/${lawyerId}`).then(res => setLawyerData(res.data));
  // }, [lawyerId]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const dateTime = dayjs(values.date[0]).format('YYYY-MM-DD') + 'T' + 
                      dayjs(values.time).format('HH:mm');
      
      await axios.post('/bookings', { 
        clientId: user.id, 
        lawyerId, 
        date: dateTime 
      });
      
      message.success('Консультация успешно записана!');
      navigate('/client-dashboard');
    } catch (error) {
      message.error('Ошибка при записи на консультацию');
      console.error('Booking error:', error);
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
      
      <Row justify="center" style={{ paddingTop: 150 }}>
        <Col xs={24} sm={22} md={20} lg={18} xl={16}>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(-1)}
            style={{ marginBottom: '16px' }}
          >
            Назад
          </Button>
          
          <Card
            title={
              <Title level={3} style={{ marginBottom: 0 }}>
                <CalendarOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                Запись на консультацию
              </Title>
            }
            style={{ borderRadius: '8px' }}
          >
            {lawyerData && (
              <Descriptions bordered column={1} style={{ marginBottom: '24px' }}>
                <Descriptions.Item label="Юрист">
                  <Space>
                    <Avatar src={lawyerData.avatar} icon={<UserOutlined />} />
                    <Text strong>{lawyerData.username}</Text>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Специализация">
                  {lawyerData.specialization || 'Не указана'}
                </Descriptions.Item>
                <Descriptions.Item label="Рейтинг">
                  <Text strong>{lawyerData.rating || 0}</Text>
                </Descriptions.Item>
              </Descriptions>
            )}

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Form.Item
                name="date"
                label="Дата консультации"
                rules={[
                  { required: true, message: 'Пожалуйста, выберите дату' }
                ]}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  disabledDate={(current) => {
                    return current && current < dayjs().startOf('day');
                  }}
                />
              </Form.Item>

              <Form.Item
                name="time"
                label="Время консультации"
                rules={[
                  { required: true, message: 'Пожалуйста, выберите время' }
                ]}
              >
                <TimePicker 
                  format="HH:mm" 
                  minuteStep={15}
                  style={{ width: '100%' }}
                  disabledTime={() => ({
                    disabledHours: () => [0, 1, 2, 3, 4, 5, 6, 22, 23],
                  })}
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  size="large"
                  block
                  icon={<CalendarOutlined />}
                >
                  Записаться на консультацию
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BookConsultationPage;