import { signIn } from 'next-auth/react';
import { Button, Space } from 'antd';

const LoginButtons = () => {
  return (
    <>
      <Space size="middle" style={{ marginTop: '16px',}}>
        <Button
          onClick={() => signIn('google')}
          type="default"
          className="google-button"
        >
          Connectez-vous avec Google
        </Button>
        <Button
          onClick={() => signIn('github')}
          type="default"
          className="github-button"
        >
          Connectez-vous avec Github
        </Button>
      </Space>
    </>
  );
};

export default LoginButtons;
