export interface PreviewStrategy {
    canHandle: (fileType: string, fileName: string) => boolean;
    preview: (file: File | string) => void;
  }