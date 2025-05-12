import {
    Button,
    Card,
    Col,
    Row,
    Typography,
    Layout,
    Space,
    Divider
} from 'antd';
import {
    BulbOutlined,
    TeamOutlined,
    PhoneOutlined,
    FileTextOutlined,
    MailOutlined,
    EnvironmentOutlined,
    InstagramOutlined,
    FacebookOutlined,
    WhatsAppOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

// Извлекаем нужные компоненты из Layout
const { Header, Footer, Content } = Layout;
const { Title, Paragraph } = Typography;

const HomePage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const features = [
        {
            icon: <BulbOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
            title: "Квалифицированные юристы",
            description: "Доступ к сети проверенных юристов с опытом работы от 5 лет"
        },
        {
            icon: <TeamOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
            title: "Для клиентов и юристов",
            description: "Платформа объединяет тех, кто нуждается в помощи, и тех, кто ее оказывает"
        },
        {
            icon: <PhoneOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
            title: "Разные форматы консультаций",
            description: "Общение через чат, видеозвонки или телефонные консультации"
        },
        {
            icon: <FileTextOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
            title: "Документооборот",
            description: "Безопасное хранение и обмен юридическими документами"
        }
    ];

    return (
        <Layout className="layout">
            {/* Main Content - добавляем отступ сверху для фиксированного header */}
            <Content style={{ padding: '0 10px', marginTop: 10 }}>
                <div className="site-layout-content">
                    {/* Hero Section */}
                    <div className="hero-section">
                        <Title level={1} style={{ marginBottom: 16 }}>LawConnect</Title>
                        <Paragraph type="secondary" style={{ fontSize: 18, marginBottom: 32 }}>
                            Платформа для удобного взаимодействия клиентов и юристов
                        </Paragraph>
                        <Space size="large">
                            <Button
                                type="primary"
                                size="large"
                                onClick={() => navigate('/register')}
                            >
                                Регистрация
                            </Button>
                            <Button
                                size="large"
                                onClick={() => navigate('/login')}
                            >
                                Войти
                            </Button>
                        </Space>
                    </div>

                    {/* Features Section */}
                    <Divider orientation="center" style={{ fontSize: 24, margin: '48px 0' }}>
                        Возможности платформы
                    </Divider>

                    <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
                        {features.map((feature, index) => (
                            <Col xs={24} sm={12} md={12} lg={6} key={index}>
                                <Card
                                    hoverable
                                    style={{ textAlign: 'center', height: '100%' }}
                                    bodyStyle={{ padding: '24px 16px' }}
                                >
                                    <div style={{ marginBottom: 16 }}>{feature.icon}</div>
                                    <Title level={4} style={{ marginBottom: 8 }}>{feature.title}</Title>
                                    <Paragraph type="secondary">{feature.description}</Paragraph>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Content>
        </Layout>
    );
};

export default HomePage;