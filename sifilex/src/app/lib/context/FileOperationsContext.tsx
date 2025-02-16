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
          // Gestion détaillée des erreurs
          let errorMessage = 'Une erreur est survenue lors du téléchargement';
          
          if (error.message?.includes('size')) {
            errorMessage = `Le fichier ${file.name} est trop volumineux. La taille maximale autorisée est de 10MB`;
          } else if (error.message?.includes('type')) {
            errorMessage = `Le type de fichier de ${file.name} n'est pas supporté`;
          } else if (error.message?.includes('unauthorized')) {
            errorMessage = 'Vous n\'êtes pas autorisé à télécharger des fichiers';
          }
  
          // Mettre à jour l'état du fichier avec l'erreur
          setFiles(prev =>
            prev.map(f =>
              f.key === fileState.key
                ? {
                    ...f,
                    progress: 'ERROR',
                    error: errorMessage // Ajoutez error au type FileState
                  }
                : f
            )
          );
  
          // Afficher l'erreur générale
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

  const handlePreviewFile = useCallback((file: FileState) => {
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