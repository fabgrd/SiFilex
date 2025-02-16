'use client';

import { useSession } from 'next-auth/react';
import ProtectedFiles from './ProtectedFiles';

const Dashboard = () => {
    const { data: session } = useSession();

    return (
        <div>
            <div>
                <ProtectedFiles />
            </div>

        </div>
    );
};

export default Dashboard;