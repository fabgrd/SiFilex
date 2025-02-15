'use client';

import { useSession } from 'next-auth/react';
import { Navbar } from '@/app/components/organisms/Navbar';
import { LoginButtons } from '@/app/components/atoms/LoginButtons';
import { UploadTemplate } from '@/app/components/templates/UploadTemplate';
// import Dashboard from "../../components/Dashboard";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <div>
          <Navbar />
          <UploadTemplate
            maxFiles={5}
            maxSize={20 * 1024 * 1024}
            acceptedFileTypes={[
              'image/*',
              'application/pdf',
              '.doc,.docx',
              '.txt,.md'
            ]}
          />
        </div>
      ) : (
        <LoginButtons />
      )}
    </div>
  );
};
