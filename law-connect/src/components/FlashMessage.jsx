import { Alert } from 'antd';
import { 
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined 
} from '@ant-design/icons';

const FlashMessage = ({ message, type, onClose }) => {
  if (!message) return null;

  const alertProps = {
    [type]: {
      icon: type === 'success' ? <CheckCircleOutlined /> : 
            type === 'error' ? <CloseCircleOutlined /> :
            type === 'warning' ? <ExclamationCircleOutlined /> :
            <InfoCircleOutlined />,
      banner: true,
      closable: true,
      showIcon: true,
      message,
      onClose,
      style: { 
        marginBottom: 16,
        borderRadius: 4
      }
    }
  };

  return (
    <Alert 
      type={type}
      {...alertProps[type]}
    />
  );
};

export default FlashMessage;