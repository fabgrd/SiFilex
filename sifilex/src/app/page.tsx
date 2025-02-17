'use client';

import { useSession } from 'next-auth/react';
import Navbar from '@/app/components/organisms/Navbar';
import AuthentificationTemplate from './components/templates/AuthentificationTemplate';
import { UploadTemplate } from '@/app/components/templates/UploadTemplate';
import { getAcceptedFileTypes, GLOBAL_MAX_FILE_SIZE, MAX_FILES } from '@/app/lib/utils/fileTypes';
import Loader from '@/app/components/atoms/Loader';
import { EdgeStoreProvider } from "@/lib/edgestore";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <Loader />
    );
  }

  return (
    <div>
      {session ? (
        <EdgeStoreProvider>
          <div>
            <Navbar />
            <UploadTemplate
              maxFiles={MAX_FILES}
              maxSize={GLOBAL_MAX_FILE_SIZE}
              acceptedFileTypes={getAcceptedFileTypes()}
            />
          </div>
        </EdgeStoreProvider>
      ) : (
        <AuthentificationTemplate />
      )}
    </div>
  );
}