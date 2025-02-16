import React from 'react';
import { Card, Typography, Space } from 'antd';
import LoginButtons from '@/app/components/atoms/LoginButtons';

const { Title, Text } = Typography;

const AuthentificationTemplate: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl" bordered={false}>
        <Space direction="vertical" size="large" className="w-full text-center">
          <Title level={2} className="text-gray-800">Bienvenue</Title>
          <Text className="text-gray-600">Connectez-vous pour continuer</Text>
          <LoginButtons />
        </Space>
      </Card>
    </div>
  );
};

export default AuthentificationTemplate;
