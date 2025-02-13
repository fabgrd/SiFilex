export type FileProgress = 'PENDING' | 'COMPLETE' | 'ERROR' | number;

export interface FileState {
  file: File;
  key: string;
  progress: FileProgress;
  renamed?: string;
}

export interface FileOperationsHook {
  files: FileState[];
  error: string | null;
  addFiles: (files: File[]) => void;
  handleFileRemove: (index: number) => void;
  handleFileRename: (index: number, newName: string) => void;
  handlePreviewFile: (file: File) => void;
}
