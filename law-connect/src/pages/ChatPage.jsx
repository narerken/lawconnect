import { useEffect, useState, useRef } from 'react';
import {
  Card,
  Input,
  Button,
  Typography,
  Avatar,
  List,
  Space,
  Badge,
  message
} from 'antd';
import {
  SendOutlined,
  UserOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const { Text } = Typography;
const { TextArea } = Input;

const ChatPage = () => {
  const { user } = useAuth();
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [partnerData, setPartnerData] = useState(null);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`/api/chat/${user.id}/${partnerId}`);
      setMessages(res.data);
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchPartnerData = async () => {
    try {
      const res = await axios.get(`/api/users/${partnerId}`);
      setPartnerData(res.data);
    } catch (error) {
      console.error('Error fetching partner data:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchPartnerData();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [partnerId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);
      await axios.post('/api/chat/send', {
        from: user.id,
        to: partnerId,
        text
      });
      setText('');
      await fetchMessages();
    } catch (error) {
      message.error('Ошибка при отправке сообщения');
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header />

      <div style={{ paddingTop: 150 }}>
        <Card
          title={
            <Space>
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
              />
              <Badge dot={partnerData?.isOnline}>
                <Avatar
                  src={partnerData?.avatar}
                  icon={<UserOutlined />}
                />
              </Badge>
              <Text strong>{partnerData?.username || 'Загрузка...'}</Text>
            </Space>
          }
          style={{
            borderRadius: '8px',
            maxWidth: 800,
            margin: '0 auto'
          }}
        >
          {/* Сообщения */}
          <div
            style={{
              height: '60vh',
              overflowY: 'auto',
              padding: '16px',
              background: '#fafafa',
              borderRadius: '8px',
              marginBottom: '16px'
            }}
          >
            <List
              dataSource={messages}
              renderItem={(msg) => (
                <List.Item
                  style={{
                    padding: '8px 0',
                    justifyContent: msg.from === user.id ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '70%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.from === user.id ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div
                      style={{
                        background: msg.from === user.id ? '#1890ff' : '#f0f0f0',
                        color: msg.from === user.id ? '#fff' : 'rgba(0, 0, 0, 0.85)',
                        padding: '8px 12px',
                        borderRadius:
                          msg.from === user.id
                            ? '12px 12px 0 12px'
                            : '12px 12px 12px 0',
                        marginBottom: '4px'
                      }}
                    >
                      {msg.text}
                    </div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </div>
                </List.Item>
              )}
            />
            <div ref={messagesEndRef} />
          </div>

          {/* Поле ввода и кнопка отправки */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <TextArea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Напишите сообщение..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              style={{
                flexGrow: 1,
                borderRadius: '8px',
                resize: 'none',
                padding: '12px',
                minHeight: '48px'
              }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={sendMessage}
              loading={loading}
              disabled={!text.trim()}
              style={{
                height: '48px',
                minWidth: '48px',
                borderRadius: '8px',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatPage;
