import React from 'react';
import { Card, Typography, Space } from 'antd';
import LoginButtons from '@/app/components/atoms/LoginButtons';

const { Title, Text } = Typography;

const AuthentificationTemplate: React.FC = () => {
  return (
    <div className="auth-container">
      <Card className="auth-card" bordered={false}>
        <Space direction="vertical" size="large" className="auth-space">
          <Title level={2} style={{ fontSize: 24, color: "#7EE1BD" }}>Bienvenue sur SiFilex</Title>
          <Text className="auth-text">Connectez-vous pour continuer</Text>
          <LoginButtons />
        </Space>
      </Card>
    </div>
  );
};

export default AuthentificationTemplate;
