import { signIn } from 'next-auth/react';
import { Button, Space, Typography } from 'antd';

const { Title } = Typography;

const LoginButtons = () => {
  return (
    <>
      <Title level={2} style={{ color: '#f44336' }}>
        You're not logged in
      </Title>
      <Space size="middle" style={{ marginTop: '16px' }}>
        <Button onClick={() => signIn('google')} type="default">
          Sign in with Google
        </Button>
        <Button
          onClick={() => signIn('github')}
          type="default"
          style={{ backgroundColor: '#4CAF50', color: 'white' }}
        >
          Sign in with GitHub
        </Button>
      </Space>
    </>
  );
};

export default LoginButtons;