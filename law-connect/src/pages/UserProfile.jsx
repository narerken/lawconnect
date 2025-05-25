import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import axios from '../api/axios';
import { 
  Input, 
  Button, 
  Typography, 
  Form, 
  message, 
  Card, 
  Upload, 
  Avatar,
  Space,
  Row,
  Col,
  Divider
} from 'antd';
import { 
  UploadOutlined, 
  UserOutlined, 
  ArrowLeftOutlined,
  MailOutlined,
  LockOutlined,
  EditOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const UserProfile = () => {
  const { user, login } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('username', values.username);
      if (values.password) formData.append('password', values.password);

      if (fileList.length > 0) {
        formData.append('avatar', fileList[0]);
      }

      const res = await axios.put('/api/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      });

      login({ ...user, ...res.data });
      message.success('Профиль успешно обновлён!');
      setFileList([]);
    } catch (err) {
      console.error('Ошибка при обновлении:', err);
      message.error(err.response?.data?.message || 'Ошибка при обновлении профиля');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = ({ fileList }) => {
    if (fileList.length > 0) {
      setFileList([fileList[fileList.length - 1].originFileObj]);
    } else {
      setFileList([]);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 16px' }}>
      <Card 
        bordered={false} 
        style={{ 
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: 8
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(-1)}
            style={{ marginBottom: 16 }}
          >
            Назад
          </Button>

          <Title level={3} style={{ marginBottom: 0, textAlign: 'center' }}>
            Настройки профиля
          </Title>
          <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 24 }}>
            Управление вашими персональными данными
          </Text>

          <Row justify="center" style={{ marginBottom: 24 }}>
            <Avatar
              size={100}
              src={
                fileList.length > 0 
                  ? URL.createObjectURL(fileList[0]) 
                  : user.avatar 
                    ? `http://localhost:5000${user.avatar}` 
                    : null
              }
              icon={<UserOutlined />}
              style={{ 
                backgroundColor: '#f0f2f5',
                border: '2px solid #1890ff'
              }}
            />
          </Row>

          <Form
            form={form}
            onFinish={onFinish}
            initialValues={{ username: user.username }}
            layout="vertical"
          >
            <Form.Item label="Email">
              <Input 
                prefix={<MailOutlined />} 
                value={user.email} 
                disabled 
                style={{ borderRadius: 6 }}
              />
            </Form.Item>

            <Form.Item 
              name="username" 
              label="Имя пользователя"
              rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                style={{ borderRadius: 6 }}
              />
            </Form.Item>

            <Form.Item 
              name="password" 
              label="Новый пароль"
              extra="Оставьте пустым, если не хотите менять пароль"
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                style={{ borderRadius: 6 }}
              />
            </Form.Item>

            <Divider />

            <Form.Item label="Аватар">
              <Upload
                beforeUpload={() => false}
                onChange={handleUploadChange}
                showUploadList={true}
                multiple={false}
                maxCount={1}
                accept="image/*"
                fileList={fileList}
              >
                <Button 
                  icon={<UploadOutlined />} 
                  style={{ borderRadius: 6 }}
                >
                  Выбрать изображение
                </Button>
              </Upload>
              <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                {fileList.length > 0 ? (
                  <>
                    <EditOutlined /> Выбран файл: {fileList[0].name}
                  </>
                ) : (
                  'JPG, PNG (макс. 5MB)'
                )}
              </Text>
            </Form.Item>

            <Form.Item style={{ marginTop: 32 }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                icon={<SaveOutlined />}
                block
                size="large"
                style={{ borderRadius: 6 }}
              >
                Сохранить изменения
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
};

export default UserProfile;