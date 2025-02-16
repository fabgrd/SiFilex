import { PreviewStrategy } from './PreviewStrategy';

export class PDFPreviewStrategy implements PreviewStrategy {
    canHandle(fileType: string, fileName: string): boolean {
      return fileType === 'application/pdf' || fileName.endsWith('.pdf');
    }
  
    preview(file: File | string): void {
      if (typeof file === 'string') {
        window.open(file, '_blank');
        return;
      }
  
      const url = URL.createObjectURL(file);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }