'use client';

import { useSession } from 'next-auth/react';
import Navbar from './Navbar';
import LoginButtons from './LoginButtons';
import Upload from './Upload';
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
        // ... existing code ...
      ) : (
        <LoginButtons />
      )}
    </div>
  );
};

export default Dashboard;