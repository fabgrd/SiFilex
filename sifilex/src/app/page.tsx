'use client';

import { useSession } from 'next-auth/react';
import { Navbar } from '@/app/components/organisms/Navbar';
import { LoginButtons } from '@/app/components/atoms/LoginButtons';
import { UploadTemplate } from '@/app/components/templates/UploadTemplate';
import { getAcceptedFileTypes, GLOBAL_MAX_FILE_SIZE, MAX_FILES } from '@/app/lib/utils/fileTypes';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <div>
          <Navbar />
          <UploadTemplate
            maxFiles={MAX_FILES}
            maxSize={GLOBAL_MAX_FILE_SIZE}
            acceptedFileTypes={getAcceptedFileTypes()}
          />
        </div>
      ) : (
        <LoginButtons />
      )}
    </div>
  );
};
