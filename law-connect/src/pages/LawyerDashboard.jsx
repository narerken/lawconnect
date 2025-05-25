import { useEffect, useState } from 'react';
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
    Statistic,
    Badge,
    message,
    Tabs
} from 'antd';
import {
    CheckOutlined,
    CloseOutlined,
    ClockCircleOutlined,
    UserOutlined,
    CalendarOutlined,
    StarOutlined,
    MessageOutlined,
    QuestionCircleOutlined,
    FormOutlined // Добавлена новая иконка
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import Header from '../components/Header';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const LawyerDashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('bookings');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const bookingsRes = await axios.get(`/api/bookings/${user.id}`);
                setBookings(bookingsRes.data);

                const questionsRes = await axios.get(`/api/questions/all`);
                setQuestions(questionsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user.id]);

    const updateStatus = async (id, status) => {
        try {
            await axios.post('/api/bookings/status', { bookingId: id, status });
            setBookings(prev => prev.map(b =>
                b._id === id ? { ...b, status } : b
            ));
            message.success(`Запись ${status === 'confirmed' ? 'подтверждена' : 'отклонена'}`);
        } catch (error) {
            message.error('Ошибка при обновлении статуса');
            console.error('Error updating booking status:', error);
        }
    };

    const getStatusTag = (status) => {
        switch (status) {
            case 'confirmed':
                return <Tag color="success">Подтверждено</Tag>;
            case 'rejected':
                return <Tag color="error">Отклонено</Tag>;
            default:
                return <Tag color="processing">Ожидает</Tag>;
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f0f2f5',
        }}>
            <Header />

            <div style={{ padding: 150 }}>
                <Row gutter={[24, 24]}>
                    <Col span={24}>
                        <Title level={2} style={{ marginBottom: 0 }}>
                            Добро пожаловать, <Text type="secondary">{user.username}</Text>
                        </Title>
                        <Text type="secondary">Ваш личный кабинет юриста</Text>
                    </Col>

                    {/* Добавлена кнопка для перехода на страницу ответов */}
                    <Col span={24}>
                        <Space style={{ marginBottom: 24 }}>
                            <Link to="/answer">
                                <Button
                                    type="primary"
                                    icon={<FormOutlined />}
                                >
                                    Ответить на вопросы
                                </Button>
                            </Link>

                            <Link to="/lawyer-rating">
                                <Button
                                    icon={<StarOutlined />}
                                    type="default"
                                >
                                     Рейтинг юристов
                                </Button>
                            </Link>
                        </Space>
                    </Col>


                    <Col xs={24} sm={12} md={8}>
                        <Card>
                            <Statistic
                                title="Ваш рейтинг"
                                value={user.points || 0}
                                prefix={<StarOutlined />}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={8}>
                        <Card>
                            <Statistic
                                title="Всего записей"
                                value={bookings.length}
                                prefix={<CalendarOutlined />}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={8}>
                        <Card>
                            <Statistic
                                title="Новых вопросов"
                                value={questions.filter(q =>
                                    !q.answers.some(a => a.lawyerId?._id === user.id)
                                ).length}
                                prefix={<QuestionCircleOutlined />}
                            />
                        </Card>
                    </Col>

                    <Col span={24}>
                        <Tabs
                            activeKey={activeTab}
                            onChange={setActiveTab}
                            tabBarStyle={{ marginBottom: 24 }}
                        >
                            <TabPane
                                tab={
                                    <span>
                                        <CalendarOutlined />
                                        Записи на консультации
                                    </span>
                                }
                                key="bookings"
                            >
                                <List
                                    loading={loading}
                                    dataSource={bookings.sort((a, b) => new Date(a.date) - new Date(b.date))}
                                    renderItem={booking => (
                                        <Card
                                            key={booking._id}
                                            style={{ marginBottom: 16, borderRadius: 8 }}
                                            hoverable
                                        >
                                            <List.Item
                                                actions={[
                                                    booking.status === 'pending' ? (
                                                        <Space>
                                                            <Button
                                                                type="primary"
                                                                icon={<CheckOutlined />}
                                                                onClick={() => updateStatus(booking._id, 'confirmed')}
                                                            >
                                                                Подтвердить
                                                            </Button>
                                                            <Button
                                                                danger
                                                                icon={<CloseOutlined />}
                                                                onClick={() => updateStatus(booking._id, 'rejected')}
                                                            >
                                                                Отклонить
                                                            </Button>
                                                        </Space>
                                                    ) : (
                                                        getStatusTag(booking.status)
                                                    ),
                                                    <Link to={`/chat/${booking.clientId?._id}`}>
                                                        <Button icon={<MessageOutlined />}>
                                                            Чат с клиентом
                                                        </Button>
                                                    </Link>
                                                ]}
                                            >
                                                <List.Item.Meta
                                                    avatar={<Avatar src={booking.clientId?.avatar} icon={<UserOutlined />} />}
                                                    title={booking.clientId?.username || 'Неизвестный клиент'}
                                                    description={
                                                        <Space direction="vertical" size={4}>
                                                            <Text>
                                                                <CalendarOutlined style={{ marginRight: 8 }} />
                                                                {dayjs(booking.date).format('D MMMM YYYY, HH:mm')}
                                                            </Text>
                                                            <Text type="secondary">
                                                                Запись создана: {dayjs(booking.createdAt).format('D MMMM YYYY')}
                                                            </Text>
                                                        </Space>
                                                    }
                                                />
                                            </List.Item>
                                        </Card>
                                    )}
                                />
                            </TabPane>
                        </Tabs>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default LawyerDashboard;