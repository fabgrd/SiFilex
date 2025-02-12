'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Button, Typography, Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Dashboard = () => {
  const { data: session } = useSession();

  return (
    <>
      {session ? (
        <>
          <Avatar
            src={session.user?.image as string}
            size={80}
            icon={<UserOutlined />}
          />
          <Title level={2} style={{ color: '#4CAF50' }}>
            Welcome back, {session.user?.name}
          </Title>
          <Paragraph style={{ fontSize: '18px', fontWeight: '600' }}>
            {session.user?.email}
          </Paragraph>
          <Button
            onClick={() => signOut()}
            type="primary"
            danger
            style={{ marginTop: '16px' }}
          >
            Sign Out
          </Button>
        </>
      ) : (
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
      )}
    </>
  );
};

export default Dashboard;
