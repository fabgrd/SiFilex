import { signIn } from 'next-auth/react';
import { Button, Space, Typography } from 'antd';

const { Title } = Typography;

const LoginButtons = () => {
  const titleStyle: React.CSSProperties = {
    color: '#f44336',
  };

  const githubButtonStyle: React.CSSProperties = {
    backgroundColor: '#4CAF50',
    color: 'white',
  };

  return (
    <>
      <Title level={2} style={titleStyle}>
        You're not logged in
      </Title>
      <Space size="middle" style={{ marginTop: '16px' }}>
        <Button onClick={() => signIn('google')} type="default">
          Sign in with Google
        </Button>
        <Button onClick={() => signIn('github')} type="default" style={githubButtonStyle}>
          Sign in with GitHub
        </Button>
      </Space>
    </>
  );
};

export default LoginButtons;