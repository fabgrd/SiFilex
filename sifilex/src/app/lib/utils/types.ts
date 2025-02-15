export type FileProgress = 'PENDING' | 'UPLOADING' | 'COMPLETE' | 'ERROR' | number;

export interface FileMetadata {
  userId: string;
  uploadedAt: string;
}

export interface FileState {
  file: {
    name: string;
    size: number;
    type: string;
  };
  key: string;
  progress: FileProgress;
  renamed?: string;
  url?: string;
  thumbnailUrl?: string | null;
  metadata?: FileMetadata;
  error?: string;
}

export interface FileOperationsHook {
  files: FileState[];
  error: string | null;
  addFiles: (files: File[]) => Promise<void>;
  handleFileRemove: (index: number) => Promise<void>;
  handleFileRename: (index: number, newName: string) => void;
  handlePreviewFile: (file: FileState) => void;
  loading: boolean;
}