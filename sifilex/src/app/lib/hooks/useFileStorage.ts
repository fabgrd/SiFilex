import { useSession } from 'next-auth/react';
import { useEdgeStore } from '@/lib/edgestore';
import { createHash } from 'crypto';

export const useFileStorage = () => {
  const { data: session } = useSession();
  const { edgestore } = useEdgeStore();

  const getUserId = () => {
    if (!session?.user?.email) return null;
    return createHash('sha256').update(session.user.email, 'utf-8').digest('hex');
  };

  const uploadFile = async (file: File) => {
    const userId = getUserId();
    if (!userId) throw new Error('User not authenticated');

    const res = await edgestore.userFiles.upload({  // Changé de myProtectedFiles à userFiles
      file,
      input: {  // Changé de options à input pour correspondre à notre configuration
        type: file.type.startsWith('image/') ? 'image' : 'document',
        name: file.name,
      },
      onProgressChange: (progress) => {
        console.log('Upload progress:', progress);
        return progress;
      },
    });

    return {
      url: res.url,
      path: res.path,
      metadata: res.metadata,
    };
  };

  const deleteFile = async (url: string) => {  // Changé de path à url
    if (!url) return;
    await edgestore.userFiles.delete({  // Changé de myProtectedFiles à userFiles
      url: url,  // Utilise l'URL plutôt que le path
    });
  };

  return {
    uploadFile,
    deleteFile,
    getUserId,
  };
};