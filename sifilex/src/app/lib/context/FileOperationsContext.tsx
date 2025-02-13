import React, { createContext, useState, useCallback } from 'react';
import { FileState } from '../utils/types';
import { createFileState } from '../utils/fileUtils';

interface FileOperationsContextType {
  files: FileState[];
  error: string | null;
  addFiles: (newFiles: File[]) => void;
  handleFileRemove: (index: number) => void;
  handleFileRename: (index: number, newName: string) => void;
  handlePreviewFile: (file: File) => void;
}

export const FileOperationsContext = createContext<FileOperationsContextType | null>(null);

export const FileOperationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<FileState[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(prev => [
      ...prev,
      ...newFiles.map(file => createFileState(file))
    ]);
    setError(null);
  }, []);

  const handleFileRemove = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleFileRename = useCallback((index: number, newName: string) => {
    setFiles(prev => 
      prev.map((file, i) => 
        i === index ? { ...file, renamed: newName } : file
      )
    );
  }, []);

  const handlePreviewFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
    URL.revokeObjectURL(url);
  }, []);

  const value = {
    files,
    error,
    addFiles,
    handleFileRemove,
    handleFileRename,
    handlePreviewFile
  };

  return (
    <FileOperationsContext.Provider value={value}>
      {children}
    </FileOperationsContext.Provider>
  );
};