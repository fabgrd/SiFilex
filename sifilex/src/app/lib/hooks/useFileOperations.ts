import { useContext } from 'react';
import { FileOperationsContext } from '../context/FileOperationsContext';

export const useFileOperations = () => {
  const context = useContext(FileOperationsContext);
  if (!context) {
    throw new Error('useFileOperations must be used within FileOperationsProvider');
  }
  return context;
};