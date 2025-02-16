import React, { createContext, useState, useCallback, useEffect } from 'react';
import { FileState } from '../utils/types';
import { createFileState } from '../utils/fileUtils';
import { useEdgeStore } from '@/lib/edgestore';
import { useSession } from 'next-auth/react';

interface FileOperationsContextType {
  files: FileState[];
  error: string | null;
  addFiles: (newFiles: File[]) => Promise<void>;
  handleFileRemove: (index: number) => Promise<void>;
  handleFileRename: (index: number, newName: string) => void;
  handlePreviewFile: (file: FileState) => void;
  loading: boolean;
}

export const FileOperationsContext = createContext<FileOperationsContextType | null>(null);

const STORAGE_KEY = 'sifilex-files';

export const FileOperationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<FileState[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { edgestore } = useEdgeStore();
  const { data: session } = useSession();

  // Charge les fichiers depuis localStorage quand la session est disponible
  useEffect(() => {
    if (session?.user?.email) {
      const userKey = `${STORAGE_KEY}-${session.user.email}`;
      console.log('🔹 User Key :', userKey);

      const savedFiles = localStorage.getItem(userKey);
      if (savedFiles) {
        try {
          const parsed = JSON.parse(savedFiles);
          console.log('📂 Loaded files from localStorage:', parsed);
          setFiles(parsed);
        } catch (e) {
          console.error('❌ Error parsing saved files:', e);
        }
      }
      setLoading(false);
    }
  }, [session]);

  // Sauvegarde les fichiers dans localStorage quand ils changent
  useEffect(() => {
    if (session?.user?.email && !loading) {
      const userKey = `${STORAGE_KEY}-${session.user.email}`;
      console.log('💾 Saving files to localStorage:', files);
      localStorage.setItem(userKey, JSON.stringify(files)); 
    }
  }, [files, session, loading]);

  const addFiles = useCallback(async (newFiles: File[]) => {
    if (!session?.user?.email) {
      setError('You must be logged in to upload files');
      return;
    }

    console.log('➕ Adding new files:', newFiles);

    try {
      for (const file of newFiles) {
        const fileState = createFileState(file);
        console.log('🆕 New File State:', fileState);
        setFiles(prev => [...prev, fileState]);

        try {
          const result = await edgestore.userFiles.upload({
            file,
            input: {
              type: file.type.startsWith('image/') ? 'image' : 'document',
              name: file.name,
            },
            onProgressChange: (progress) => {
              console.log(`📊 Upload progress for ${file.name}:`, progress);
              setFiles(prev =>
                prev.map(f =>
                  f.key === fileState.key ? { ...f, progress } : f
                )
              );
            },
          });

          console.log('✅ Upload successful:', result);

          setFiles(prev =>
            prev.map(f =>
              f.key === fileState.key
                ? {
                    ...f,
                    progress: 'COMPLETE',
                    url: result.url,
                    metadata: {
                      userId: session.user?.email || '',
                      uploadedAt: new Date().toISOString(),
                    },
                  }
                : f
            )
          );
        } catch (uploadError) {
          console.error('❌ Upload error:', uploadError);
          setFiles(prev =>
            prev.map(f =>
              f.key === fileState.key ? { ...f, progress: 'ERROR' } : f
            )
          );
        }
      }
    } catch (err) {
      setError('Failed to upload files');
      console.error('❌ Upload error (global catch):', err);
    }
  }, [edgestore, session]);

  const handleFileRemove = useCallback(async (index: number) => {
    const file = files[index];
    console.log('🗑 Removing file:', file);

    if (file.url) {
      try {
        await edgestore.userFiles.delete({
          url: file.url,
        });
        console.log('✅ File deleted from storage:', file.url);
      } catch (err) {
        console.error('❌ Delete error:', err);
        setError('Failed to delete file');
        return;
      }
    }
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, [files, edgestore]);

  const handleFileRename = useCallback((index: number, newName: string) => {
    console.log(`✏️ Renaming file at index ${index} to:`, newName);
    setFiles(prev =>
      prev.map((file, i) =>
        i === index ? { ...file, renamed: newName } : file
      )
    );
  }, []);

  const handlePreviewFile = useCallback((file: FileState) => {
    console.log('👀 Previewing file:', file);
    if (file.url) {
      window.open(file.url, '_blank');
    } else {
      const url = URL.createObjectURL(file.file);
      window.open(url, '_blank');
      URL.revokeObjectURL(url);
    }
  }, []);

  const value = {
    files,
    error,
    addFiles,
    handleFileRemove,
    handleFileRename,
    handlePreviewFile,
    loading
  };

  return (
    <FileOperationsContext.Provider value={value}>
      {children}
    </FileOperationsContext.Provider>
  );
};
