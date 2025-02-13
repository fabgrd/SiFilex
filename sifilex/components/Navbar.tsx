'use client';

import { signOut, useSession } from 'next-auth/react';
import { Avatar, Button, Space, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title } = Typography;

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav style={navbarStyle}>
      <Link href="/" style={logoStyle}>
        <Title level={2} style={{ color: '#fff', margin: 0 }}>
          SiFilex
        </Title>
      </Link>

      {session && (
        <Space size="middle" style={userInfoStyle}>
          <div style={welcomeMessageStyle}>
            <Typography.Text style={{ color: '#fff', fontSize: '16px' }}>
              Bienvenue, {session.user?.name}
            </Typography.Text>
          </div>
          <Button
            onClick={() => signOut()}
            type="primary"
            danger
          >
            Déconnecter
          </Button>
        </Space>
      )}
      
    </nav>
  );
};

const navbarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '12px 24px',
  backgroundColor: '#1890ff',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  justifyContent: 'space-between',
};

const logoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};

const userInfoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};

const welcomeMessageStyle: React.CSSProperties = {
  marginRight: '12px',
};

export default Navbar;
