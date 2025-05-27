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
    message,
    Tabs
} from 'antd';
import {
    CheckOutlined,
    CloseOutlined,
    CalendarOutlined,
    UserOutlined,
    StarOutlined,
    MessageOutlined,
    QuestionCircleOutlined,
    FormOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import axios from '../api/axios';
import Header from '../components/Header';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const LawyerDashboard = () => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const { t } = useTranslation();
    const isDark = theme === 'dark';

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
            setBookings(prev =>
                prev.map(b => (b._id === id ? { ...b, status } : b))
            );
            message.success(t(status === 'confirmed' ? 'confirmed' : 'rejected'));
        } catch (error) {
            message.error(t('statusUpdateError'));
            console.error('Error updating booking status:', error);
        }
    };

    const getStatusTag = (status) => {
        switch (status) {
            case 'confirmed':
                return <Tag color="success">{t('confirmed')}</Tag>;
            case 'rejected':
                return <Tag color="error">{t('rejected')}</Tag>;
            default:
                return <Tag color="processing">{t('pending')}</Tag>;
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: isDark ? '#141414' : '#f0f2f5',
            color: isDark ? '#f0f0f0' : '#000'
        }}>
            <Header />

            <div style={{ padding: 150 }}>
                <Row gutter={[24, 24]}>
                    <Col span={24}>
                        <Title level={2} style={{ marginBottom: 0, color: isDark ? '#fff' : '#000' }}>
                            {t('welcome')}, <Text type="secondary" style={{ color: isDark ? '#bbb' : undefined }}>{user.username}</Text>
                        </Title>
                        <Text type="secondary" style={{ color: isDark ? '#888' : undefined }}>
                            {t('lawyerDashboard')}
                        </Text>
                    </Col>

                    <Col span={24}>
                        <Space style={{ marginBottom: 24 }}>
                            <Link to="/answer">
                                <Button type="primary" icon={<FormOutlined />}>
                                    {t('answerQuestions')}
                                </Button>
                            </Link>

                            <Link to="/lawyer-rating">
                                <Button icon={<StarOutlined />} type="default">
                                    {t('lawyerRating')}
                                </Button>
                            </Link>
                        </Space>
                    </Col>

                    <Col xs={24} sm={12} md={8}>
                        <Card style={{ backgroundColor: isDark ? '#1f1f1f' : '#fff' }}>
                            <Statistic
                                title={t('yourRating')}
                                value={user.points || 0}
                                prefix={<StarOutlined />}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={8}>
                        <Card style={{ backgroundColor: isDark ? '#1f1f1f' : '#fff' }}>
                            <Statistic
                                title={t('totalBookings')}
                                value={bookings.length}
                                prefix={<CalendarOutlined />}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={8}>
                        <Card style={{ backgroundColor: isDark ? '#1f1f1f' : '#fff' }}>
                            <Statistic
                                title={t('newQuestions')}
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
                            tabBarStyle={{ marginBottom: 24, color: isDark ? '#fff' : undefined }}
                        >
                            <TabPane
                                tab={
                                    <span style={{ color: isDark ? '#fff' : undefined }}>
                                        <CalendarOutlined /> {t('consultationBookings')}
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
                                            style={{
                                                marginBottom: 16,
                                                borderRadius: 8,
                                                backgroundColor: isDark ? '#1f1f1f' : '#fff',
                                                color: isDark ? '#fff' : undefined
                                            }}
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
                                                                {t('confirm')}
                                                            </Button>
                                                            <Button
                                                                danger
                                                                icon={<CloseOutlined />}
                                                                onClick={() => updateStatus(booking._id, 'rejected')}
                                                            >
                                                                {t('reject')}
                                                            </Button>
                                                        </Space>
                                                    ) : (
                                                        getStatusTag(booking.status)
                                                    ),
                                                    <Link to={`/chat/${booking.clientId?._id}`}>
                                                        <Button icon={<MessageOutlined />}>
                                                            {t('chatWithClient')}
                                                        </Button>
                                                    </Link>
                                                ]}
                                            >
                                                <List.Item.Meta
                                                    avatar={
                                                        <Avatar
                                                            src={booking.clientId?.avatar}
                                                            icon={<UserOutlined />}
                                                        />
                                                    }
                                                    title={
                                                        <span style={{ color: isDark ? '#fff' : undefined }}>
                                                            {booking.clientId?.username || t('unknownClient')}
                                                        </span>
                                                    }
                                                    description={
                                                        <Space direction="vertical" size={4}>
                                                            <Text style={{ color: isDark ? '#ccc' : undefined }}>
                                                                <CalendarOutlined style={{ marginRight: 8 }} />
                                                                {dayjs(booking.date).format('D MMMM YYYY, HH:mm')}
                                                            </Text>
                                                            <Text type="secondary" style={{ color: isDark ? '#888' : undefined }}>
                                                                {t('createdAt')}: {dayjs(booking.createdAt).format('D MMMM YYYY')}
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