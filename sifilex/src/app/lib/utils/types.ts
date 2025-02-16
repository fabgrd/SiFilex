export type FileProgress = 'PENDING' | 'UPLOADING' | 'COMPLETE' | 'ERROR' | number;

export interface FileMetadata {
  userId: string;
  uploadedAt: string;
}

export interface FileState {
  file: File;
  key: string;
  progress: FileProgress;
  renamed?: string;
  url?: string;
  thumbnailUrl?: string | null;
  metadata?: FileMetadata;
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