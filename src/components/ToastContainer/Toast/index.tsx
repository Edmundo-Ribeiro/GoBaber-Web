import React, { useEffect } from 'react';
import {
  FiAlertCircle,
  FiXCircle,
  FiInfo,
  FiCheckCircle,
} from 'react-icons/fi';

import { useToast, ToastMessage } from '../../../hooks/Toast';
import { Container } from './styles';

interface ToastProps {
  message: ToastMessage;
  style: object;
}

const icon = {
  info: <FiInfo size={20} />,
  error: <FiAlertCircle size={20} />,
  success: <FiCheckCircle size={20} />,
};

const Toast: React.FC<ToastProps> = ({ message, style }) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [removeToast, message.id]);

  return (
    <Container style={style} type={message.type}>
      {icon[message.type || 'info']}

      <div>
        <strong>{message.title}</strong>
        <p>{message?.description}</p>
      </div>

      <button onClick={() => removeToast(message.id)} type="button">
        <FiXCircle size={20} />
      </button>
    </Container>
  );
};

export default Toast;
