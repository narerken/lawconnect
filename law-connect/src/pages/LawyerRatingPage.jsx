import { useEffect, useState } from 'react';
import { 
  Card, 
  List, 
  Avatar, 
  Typography, 
  Row, 
  Col,
  Tag,
  Divider,
  Statistic,
  Badge,
  Space
} from 'antd';
import { 
  CrownOutlined,
  StarOutlined,
  TrophyOutlined,
  UserOutlined
} from '@ant-design/icons';
import axios from '../api/axios';
import Header from '../components/Header';

const { Title, Text } = Typography;

const LawyerRatingPage = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/questions/all');
        const ratingMap = {};

        res.data.forEach(q => {
          q.answers.forEach(ans => {
            if (!ans.lawyerId) return;
            const id = ans.lawyerId._id;
            if (!ratingMap[id]) {
              ratingMap[id] = { 
                ...ans.lawyerId, 
                rating: 0,
                answersCount: 0,
                bestAnswers: 0
              };
            }
            ratingMap[id].rating += ans.isBest ? 10 : 1;
            ratingMap[id].answersCount += 1;
            if (ans.isBest) ratingMap[id].bestAnswers += 1;
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

  const getMedalColor = (index) => {
    switch(index) {
      case 0: return '#ffd700'; 
      case 1: return '#c0c0c0'; 
      case 2: return '#cd7f32';
      default: return null;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f0f2f5',
    }}>
      <Header />
      
      <div style={{ padding: 150}}>
        <Row justify="center">
          <Col xs={24} md={22} lg={20} xl={18}>
            <Card
              title={
                <Title level={3} style={{ marginBottom: 0 }}>
                  <TrophyOutlined style={{ marginRight: '8px', color: '#faad14' }} />
                  Рейтинг юристов
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
                          title="Лучших ответов" 
                          value={lawyer.bestAnswers} 
                        />
                      </Space>
                    }
                  >
                    <List.Item.Meta
                      avatar={
                        <Badge 
                          count={index + 1}
                          style={{ 
                            backgroundColor: getMedalColor(index),
                            color: index < 3 ? '#fff' : '#000'
                          }}
                        >
                          <Avatar 
                            size={64} 
                            src={lawyer.avatar} 
                            icon={<UserOutlined />}
                            style={{ border: `2px solid ${getMedalColor(index) || '#ddd'}` }}
                          />
                        </Badge>
                      }
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
                          <Tag>Ответов: {lawyer.answersCount}</Tag>
                        </Space>
                      }
                    />
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

export default LawyerRatingPage;