import { useEffect, useState, useRef } from 'react';
import {
  Card,
  List,
  Avatar,
  Button,
  Typography,
  Space,
  Divider,
  Tag,
  Row,
  Col,
  Select,
  Alert
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
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const { Title, Text } = Typography;
const { Option } = Select;

const ClientDashboard = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [newAnswerNotification, setNewAnswerNotification] = useState(false);

  const initialLoad = useRef(true);
  const prevQuestionsRef = useRef([]);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`/api/questions/client/${user.id}`);
      const newQuestions = res.data;

      if (!initialLoad.current) {
        const hasNewAnswers = newQuestions.some(q => {
          const prev = prevQuestionsRef.current.find(p => p._id === q._id);
          return prev && q.answers.length > prev.answers.length;
        });

        if (hasNewAnswers) {
          setNewAnswerNotification(true);
        }
      }

      setQuestions(newQuestions);
      prevQuestionsRef.current = newQuestions;
      initialLoad.current = false;
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    const interval = setInterval(fetchQuestions, 10000);
    return () => clearInterval(interval);
  }, [user.id]);

  const markBest = async (questionId, index) => {
    try {
      await axios.post(`/api/questions/mark-best/${questionId}/${index}`);
      setQuestions(prev =>
        prev.map(q =>
          q._id === questionId
            ? {
              ...q,
              answers: q.answers.map((a, i) =>
                i === index ? { ...a, isBest: true } : { ...a, isBest: false }
              )
            }
            : q
        )
      );
    } catch (error) {
      console.error('Error marking best answer:', error);
    }
  };

  const isDark = theme === 'dark';

  const filteredSortedQuestions = questions
    .filter(q => {
      if (filter === 'answered') return q.answers.length > 0;
      if (filter === 'unanswered') return q.answers.length === 0;
      return true;
    })

  return (
    <div
      style={{
        backgroundColor: isDark ? '#141414' : '#f5f5f5',
        color: isDark ? '#f0f0f0' : '#000',
        minHeight: '100vh'
      }}
    >
      <Header />

      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '24px',
          paddingTop: '120px'
        }}
      >
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Title
              level={2}
              style={{ marginBottom: 0, color: isDark ? '#fff' : '#000' }}
            >
              {t('welcome')},{' '}
              <Text type="secondary" style={{ color: isDark ? '#bbb' : undefined }}>
                {user.username}
              </Text>
            </Title>
            <Text type="secondary" style={{ color: isDark ? '#888' : undefined }}>
              {t('clientDashboard')}
            </Text>
          </Col>

          <Col span={24}>
            <Space size="large">
              <Link to="/ask">
                <Button type="primary" icon={<PlusOutlined />}>
                  {t('askQuestion')}
                </Button>
              </Link>
              <Link to="/lawyers">
                <Button icon={<SearchOutlined />}>{t('findLawyer')}</Button>
              </Link>
            </Space>
          </Col>

          <Col span={24}>
            <Space style={{ marginBottom: 16 }}>
              <Select value={filter} onChange={setFilter}>
                <Option value="all">{t('allQuestions')}</Option>
                <Option value="answered">{t('answeredQuestions')}</Option>
                <Option value="unanswered">{t('unansweredQuestions')}</Option>
              </Select>
            </Space>

            {newAnswerNotification && (
              <Alert
                message={t('newAnswerReceived')}
                description=""
                type="info"
                showIcon
                closable
                onClose={() => setNewAnswerNotification(false)}
                style={{
                  marginBottom: 16,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              />
            )}

            <Divider
              orientation="left"
              style={{
                borderColor: isDark ? '#303030' : '#f0f0f0',
                color: isDark ? '#fff' : undefined
              }}
            >
              <Title
                level={4}
                style={{ marginBottom: 0, color: isDark ? '#fff' : '#000' }}
              >
                <MessageOutlined style={{ marginRight: 8 }} />
                {t('yourQuestions')}
              </Title>
            </Divider>

            <List
              itemLayout="vertical"
              loading={loading}
              dataSource={filteredSortedQuestions}
              renderItem={question => (
                <Card
                  key={question._id}
                  style={{
                    marginBottom: 16,
                    borderRadius: 8,
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                    backgroundColor: isDark ? '#1f1f1f' : '#fff',
                    color: isDark ? '#fff' : undefined
                  }}
                  hoverable
                >
                  <Text strong style={{ fontSize: 16, color: isDark ? '#fff' : undefined }}>
                    {question.text}
                  </Text>

                  <Divider
                    style={{
                      margin: '12px 0',
                      borderColor: isDark ? '#303030' : '#f0f0f0'
                    }}
                  />

                  {question.answers.length > 0 ? (
                    <List
                      dataSource={question.answers}
                      renderItem={(answer, index) => (
                        <List.Item
                          key={index}
                          style={{
                            padding: '12px 0',
                            color: isDark ? '#ddd' : undefined
                          }}
                          actions={[
                            answer.isBest ? (
                              <Tag icon={<CheckOutlined />} color="success">
                                {t('bestAnswer')}
                              </Tag>
                            ) : (
                              <Button
                                size="small"
                                onClick={() => markBest(question._id, index)}
                                icon={<CrownOutlined />}
                              >
                                {t('markBest')}
                              </Button>
                            )
                          ]}
                        >
                          <List.Item.Meta
                            avatar={<Avatar icon={<UserOutlined />} />}
                            title={
                              <span style={{ color: isDark ? '#fff' : undefined }}>
                                {answer.lawyerId?.username || t('anonymousLawyer')}
                              </span>
                            }
                            description={
                              <span style={{ color: isDark ? '#aaa' : undefined }}>
                                {answer.text}
                              </span>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Text type="secondary" style={{ color: isDark ? '#666' : undefined }}>
                      {t('noAnswers')}
                    </Text>
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
