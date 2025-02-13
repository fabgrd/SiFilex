'use client';

import { useSession } from 'next-auth/react';
import Navbar from './Navbar';
import LoginButtons from './LoginButtons';
import ProtectedFiles from './ProtectedFiles';

const Dashboard = () => {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <div>
          <Navbar />
          <ProtectedFiles />
        </div>
      ) : (
        <LoginButtons />
      )}
    </div>
  );
};

export default Dashboard;