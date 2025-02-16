import { PreviewStrategy } from './PreviewStrategy';

export class DefaultPreviewStrategy implements PreviewStrategy {
    canHandle(fileType: string, fileName: string): boolean {
      return true;  // Fallback strategy
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