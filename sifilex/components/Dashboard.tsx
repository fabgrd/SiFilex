'use client';

import { useSession } from 'next-auth/react';
import Navbar from './Navbar';
import LoginButtons from './LoginButtons';
import Upload from './Upload';

const Dashboard = () => {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <div>
          <Navbar />
          <Upload />
        </div>
        // ... existing code ...
      ) : (
        <LoginButtons />
      )}
    </div>
  );
};

export default Dashboard;