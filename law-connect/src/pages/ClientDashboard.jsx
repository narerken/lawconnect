import { useEffect, useState } from 'react';
import { 
  Card, 
  List, 
  Avatar, 
  Button, 
  Typography, 
  Space, 
  Divider,
  Badge,
  Tag,
  Row,
  Col
} from 'antd';
import { 
  MessageOutlined, 
  UserOutlined,
  CrownOutlined,
  PlusOutlined,
  SearchOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const { Title, Text } = Typography;

const ClientDashboard = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/questions/client/${user.id}`);
        setQuestions(res.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [user.id]);

  const markBest = async (questionId, index) => {
    try {
      await axios.post(`/api/questions/mark-best/${questionId}/${index}`);
      setQuestions(prev => prev.map(q => 
        q._id === questionId 
          ? { 
              ...q, 
              answers: q.answers.map((a, i) => 
                i === index ? { ...a, isBest: true } : { ...a, isBest: false }
              ) 
            } 
          : q
      ));
    } catch (error) {
      console.error('Error marking best answer:', error);
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <Header />
      
      <div style={{ 
        maxWidth: 1200,
        margin: '0 auto',
        padding: '24px',
        paddingTop: '120px'
      }}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Title level={2} style={{ marginBottom: 0 }}>
              Добро пожаловать, <Text type="secondary">{user.username}</Text>
            </Title>
            <Text type="secondary">Ваш личный кабинет клиента</Text>
          </Col>

          <Col span={24}>
            <Space size="large">
              <Link to="/ask">
                <Button type="primary" icon={<PlusOutlined />}>
                  Задать вопрос
                </Button>
              </Link>
              <Link to="/lawyers">
                <Button icon={<SearchOutlined />}>
                  Найти юриста
                </Button>
              </Link>
            </Space>
          </Col>

          <Col span={24}>
            <Divider orientation="left">
              <Title level={4} style={{ marginBottom: 0 }}>
                <MessageOutlined style={{ marginRight: 8 }} />
                Ваши вопросы
              </Title>
            </Divider>
            
            <List
              itemLayout="vertical"
              loading={loading}
              dataSource={questions}
              renderItem={question => (
                <Card 
                  key={question._id} 
                  style={{ 
                    marginBottom: 16, 
                    borderRadius: 8,
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                  }}
                  hoverable
                >
                  <Text strong style={{ fontSize: 16 }}>{question.text}</Text>
                  
                  <Divider style={{ margin: '12px 0', borderColor: '#f0f0f0' }} />
                  
                  {question.answers.length > 0 ? (
                    <List
                      dataSource={question.answers}
                      renderItem={(answer, index) => (
                        <List.Item
                          key={index}
                          style={{ padding: '12px 0' }}
                          actions={[
                            answer.isBest ? (
                              <Tag icon={<CheckOutlined />} color="success">
                                Лучший ответ
                              </Tag>
                            ) : (
                              <Button 
                                size="small" 
                                onClick={() => markBest(question._id, index)}
                                icon={<CrownOutlined />}
                              >
                                Выбрать лучшим
                              </Button>
                            )
                          ]}
                        >
                          <List.Item.Meta
                            avatar={<Avatar icon={<UserOutlined />} />}
                            title={answer.lawyerId?.username || 'Анонимный юрист'}
                            description={answer.text}
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Text type="secondary">Пока нет ответов</Text>
                  )}
                </Card>
              )}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ClientDashboard;