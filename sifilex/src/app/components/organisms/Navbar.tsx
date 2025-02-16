'use client';

import { signOut, useSession } from 'next-auth/react';
import { Button, Typography } from 'antd';
import Image from "next/image";
import Link from 'next/link';

const { Title } = Typography;

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-logo">
      <Image
          src="/assets/Logo-Silex-Green.svg"
          alt="Logo SiFilex"
          width={40}
          height={40}
        />
        <Typography.Title level={1}>
          SiFilex
        </Typography.Title>
      </Link>

      {session && (
        <div className="navbar-user">
          <Typography.Text>
            Bienvenue, {session.user?.name}
          </Typography.Text>
          <Button
            onClick={() => signOut()}
            type="primary"
            danger
            className="logout-button"
          >
            Déconnecter
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
