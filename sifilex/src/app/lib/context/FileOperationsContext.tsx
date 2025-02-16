import React, { createContext, useState, useCallback, useEffect } from 'react';
import { FileState } from '../utils/types';
import { createFileState } from '../utils/fileUtils';
import { useEdgeStore } from '@/lib/edgestore';
import { useSession } from 'next-auth/react';
import { PreviewManager } from '../strategies/PreviewManager';
import { message } from 'antd';

interface FileOperationsContextType {
  files: FileState[];
  error: string | null;
  addFiles: (newFiles: File[]) => Promise<void>;
  handleFileRemove: (index: number) => Promise<void>;
  handleFileRename: (index: number, newName: string) => void;
  handlePreviewFile: (file: FileState) => void;
  handleDownloadFile: (file: FileState) => void;
  handleCopySecureUrl: (file: FileState) => Promise<void>;
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
  const previewManager = new PreviewManager();

  useEffect(() => {
    if (session?.user?.email) {
      const userKey = `${STORAGE_KEY}-${session.user.email}`;
      const savedFiles = localStorage.getItem(userKey);
      if (savedFiles) {
        try {
          setFiles(JSON.parse(savedFiles));
        } catch (e) {
          console.error('Error parsing saved files:', e);
        }
      }
      setLoading(false);
    }
  }, [session]);

  // Sauvegarde les fichiers dans localStorage quand ils changent
  useEffect(() => {
    if (session?.user?.email && !loading) {
      const userKey = `${STORAGE_KEY}-${session.user.email}`;
      localStorage.setItem(userKey, JSON.stringify(files));
    }
  }, [files, session, loading]);

  const addFiles = useCallback(async (newFiles: File[]) => {
    if (!session?.user?.email) {
      setError('Vous devez être connecté pour télécharger des fichiers');
      return;
    }

    try {
      for (const file of newFiles) {
        const fileState = createFileState(file);
        setFiles(prev => [...prev, fileState]);

        try {
          const result = await edgestore.userFiles.upload({
            file,
            input: {
              type: file.type.startsWith('image/') ? 'image' : 'document',
              name: file.name,
            },
            onProgressChange: (progress) => {
              setFiles(prev =>
                prev.map(f =>
                  f.key === fileState.key ? { ...f, progress } : f
                )
              );
            },
          });

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
        } catch (error: any) {
          // Gestion  des erreurs
          let errorMessage = 'Une erreur est survenue lors du téléchargement';

          if (error.message?.includes('size')) {
            errorMessage = `Le fichier ${file.name} est trop volumineux. La taille maximale autorisée est de 10MB`;
          } else if (error.message?.includes('type')) {
            errorMessage = `Le type de fichier de ${file.name} n'est pas supporté`;
          } else if (error.message?.includes('unauthorized')) {
            errorMessage = 'Vous n\'êtes pas autorisé à télécharger des fichiers';
          }

          setFiles(prev =>
            prev.map(f =>
              f.key === fileState.key
                ? {
                  ...f,
                  progress: 'ERROR',
                  error: errorMessage
                }
                : f
            )
          );
          setError(errorMessage);
        }
      }
    } catch (err) {
      setError('Une erreur inattendue est survenue');
    }
  }, [edgestore, session]);

  const handleFileRemove = useCallback(
    async (index: number) => {
      setFiles(prev => prev.filter((_, i) => i !== index));
    },
    []
  );

  const handleFileRename = useCallback((index: number, newName: string) => {
    setFiles(prev =>
      prev.map((file, i) =>
        i === index ? { ...file, renamed: newName } : file
      )
    );
  }, []);

  const handlePreviewFile = useCallback(async (file: FileState) => {
    try {
      if (file.url) {
        await previewManager.previewFile(file.url);
      } else {
        await previewManager.previewFile(file.file);
      }
    } catch (error) {
      console.error('Error previewing file:', error);
    }
  }, []);

  const handleDownloadFile = useCallback((file: FileState) => {
    if (!file.url) {
      console.warn('No URL available for download');
      return;
    }

    try {
      const a = document.createElement("a");
      a.style.display = 'none';
      a.href = file.url;
      a.download = file.renamed || file.file.name;

      document.body.appendChild(a);
      a.click();

      requestAnimationFrame(() => {
        document.body.removeChild(a);
      });
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }, []);

  const handleCopySecureUrl = useCallback(async (file: FileState) => {
    if (!file.url) {
      message.error('Aucune URL disponible');
      return;
    }
  
    try {
      const directUrl = new URL(file.url);
      const edgestoreUrl = directUrl.searchParams.get('url');
      
      if (!edgestoreUrl) {
        message.error('URL invalide');
        return;
      }
  
      const decodedUrl = decodeURIComponent(edgestoreUrl);
      await navigator.clipboard.writeText(decodedUrl);
      message.success('URL copiée dans le presse-papier');
    } catch (error) {
      console.error('Error copying URL:', error);
      message.error('Erreur lors de la copie de l\'URL');
    }
  }, []);

  const value = {
    files,
    error,
    addFiles,
    handleFileRemove,
    handleFileRename,
    handlePreviewFile,
    handleDownloadFile,
    handleCopySecureUrl,
    loading
  };

  return (
    <FileOperationsContext.Provider value={value}>
      {children}
    </FileOperationsContext.Provider>
  );
};