import { FileState } from './types';

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const createFileState = (file: File): FileState => ({
  file: file,
  key: Math.random().toString(36).slice(2),
  progress: 'PENDING'
});

export const validateFile = (
  file: File,
  maxSize?: number,
  acceptedTypes?: string[]
): string | null => {
  if (maxSize && file.size > maxSize) {
    return `File size exceeds ${formatFileSize(maxSize)}`;
  }

  if (acceptedTypes && acceptedTypes.length > 0) {
    const fileType = file.type || '';
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const isValidType = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return extension === type.slice(1);
      }
      if (type.includes('*')) {
        return fileType.startsWith(type.split('*')[0]);
      }
      return fileType === type;
    });

    if (!isValidType) {
      return 'File type not supported';
    }
  }

  return null;
};

export const simulateFileUpload = (
  file: FileState,
  onProgress: (progress: number) => void,
  onComplete: () => void
): void => {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 30;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      onComplete();
    }
    onProgress(Math.min(progress, 100));
  }, 500);
};