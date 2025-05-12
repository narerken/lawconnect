import { useEffect, useState } from 'react';
import { 
  Card, 
  List, 
  Avatar, 
  Button, 
  Typography, 
  Input, 
  Space,
  Divider,
  Tag,
  message,
  Skeleton
} from 'antd';
import { 
  MessageOutlined,
  UserOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import Header from '../components/Header';

const { Title, Text } = Typography;
const { TextArea } = Input;

const AnswerQuestionPage = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get('/questions/all');
        const unanswered = res.data.filter(q =>
          !q.answers.some(a => a.lawyerId?._id === user.id)
        );
        setQuestions(unanswered);
      } catch (error) {
        console.error('Error fetching questions:', error);
        message.error('Ошибка при загрузке вопросов');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [user.id]);

  const handleSubmit = async (qId) => {
    try {
      setSubmitting(prev => ({ ...prev, [qId]: true }));
      const text = answers[qId];
      
      if (!text?.trim()) {
        message.warning('Пожалуйста, введите ответ');
        return;
      }

      await axios.post('/questions/answer', { 
        questionId: qId, 
        lawyerId: user.id, 
        text 
      });
      
      message.success('Ответ успешно отправлен!');
      setQuestions(prev => prev.filter(q => q._id !== qId));
      setAnswers(prev => {
        const newAnswers = { ...prev };
        delete newAnswers[qId];
        return newAnswers;
      });
    } catch (error) {
      console.error('Error submitting answer:', error);
      message.error('Ошибка при отправке ответа');
    } finally {
      setSubmitting(prev => ({ ...prev, [qId]: false }));
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f0f2f5',
    }}>
      <Header />
      
      <div style={{ padding: 150 }}>
        <Card
          title={
            <Title level={3} style={{ marginBottom: 0 }}>
              <QuestionCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              Ответы на вопросы
            </Title>
          }
          style={{ borderRadius: '8px' }}
        >
          {loading ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : questions.length === 0 ? (
            <Text type="secondary">Нет вопросов, требующих ответа</Text>
          ) : (
            <List
              dataSource={questions}
              renderItem={question => (
                <Card 
                  key={question._id} 
                  style={{ marginBottom: 16, borderRadius: 8 }}
                  hoverable
                >
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={question.clientId?.avatar} icon={<UserOutlined />} />}
                      title={question.clientId?.username || 'Анонимный клиент'}
                      description={
                        <Space direction="vertical" size={8} style={{ width: '100%' }}>
                          <Text strong>{question.text}</Text>
                          <Text type="secondary">
                            Задан: {new Date(question.createdAt).toLocaleDateString()}
                          </Text>
                          
                          <Divider style={{ margin: '12px 0' }} />
                          
                          <TextArea
                            value={answers[question._id] || ''}
                            onChange={e => setAnswers({ 
                              ...answers, 
                              [question._id]: e.target.value 
                            })}
                            placeholder="Введите ваш ответ..."
                            autoSize={{ minRows: 3, maxRows: 6 }}
                            style={{ marginBottom: '12px' }}
                          />
                          
                          <Button
                            type="primary"
                            icon={<MessageOutlined />}
                            onClick={() => handleSubmit(question._id)}
                            loading={submitting[question._id]}
                            disabled={!answers[question._id]?.trim()}
                          >
                            Отправить ответ
                          </Button>
                        </Space>
                      }
                    />
                  </List.Item>
                </Card>
              )}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default AnswerQuestionPage;