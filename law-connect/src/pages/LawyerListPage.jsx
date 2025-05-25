import { useEffect, useState } from 'react';
import { 
  List, 
  Avatar, 
  Card, 
  Typography, 
  Row, 
  Col,
  Tag,
  Divider,
  Space,
  Statistic,
  Button
} from 'antd';
import { 
  MessageOutlined,
  CalendarOutlined,
  StarOutlined,
  CrownOutlined
} from '@ant-design/icons';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const { Title, Text } = Typography;

const LawyerListPage = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const res = await axios.get('/api/questions/all');
        const ratingMap = {};

        res.data.forEach(q => {
          q.answers.forEach(ans => {
            if (!ans.lawyerId) return;
            const id = ans.lawyerId._id;
            if (!ratingMap[id]) {
              ratingMap[id] = { ...ans.lawyerId, rating: 0, answersCount: 0 };
            }
            ratingMap[id].rating += ans.isBest ? 10 : 1;
            ratingMap[id].answersCount += 1;
          });
        });

        const sorted = Object.values(ratingMap).sort((a, b) => b.rating - a.rating);
        setLawyers(sorted);
      } catch (error) {
        console.error('Error fetching lawyers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLawyers();
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f0f2f5',
    }}>
      <Header />
      
      <div style={{ paddingTop: 150  }}>
        <Row justify="center">
          <Col xs={24} md={22} lg={20} xl={18}>
            <Card
              title={
                <Title level={3} style={{ marginBottom: 0 }}>
                  <CrownOutlined style={{ marginRight: '8px', color: '#faad14' }} />
                  Юристы по рейтингу
                </Title>
              }
              loading={loading}
              style={{ borderRadius: '8px' }}
            >
              <List
                itemLayout="vertical"
                dataSource={lawyers}
                renderItem={(lawyer, index) => (
                  <List.Item
                    key={lawyer._id}
                    extra={
                      <Space size="large">
                        <Statistic 
                          title="Рейтинг" 
                          value={lawyer.rating} 
                          prefix={<StarOutlined />}
                        />
                        <Statistic 
                          title="Ответов" 
                          value={lawyer.answersCount} 
                        />
                      </Space>
                    }
                  >
                    <List.Item.Meta
                      avatar={<Avatar size="large" src={lawyer.avatar}>{lawyer.username.charAt(0)}</Avatar>}
                      title={
                        <Space>
                          <Text strong>{lawyer.username}</Text>
                          {index < 3 && (
                            <Tag color={index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze'}>
                              {index === 0 ? 'Топ 1' : index === 1 ? 'Топ 2' : 'Топ 3'}
                            </Tag>
                          )}
                        </Space>
                      }
                      description={
                        <Space size="small">
                          <Tag icon={<StarOutlined />} color="gold">
                            Эксперт
                          </Tag>
                          <Tag>Специализация</Tag>
                        </Space>
                      }
                    />
                    
                    <Divider style={{ margin: '12px 0' }} />
                    
                    <Space>
                      <Link to={`/book/${lawyer._id}`}>
                        <Button type="primary" icon={<CalendarOutlined />}>
                          Записаться
                        </Button>
                      </Link>
                      <Link to={`/chat/${lawyer._id}`}>
                        <Button icon={<MessageOutlined />}>
                          Написать
                        </Button>
                      </Link>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default LawyerListPage;