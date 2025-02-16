import { PreviewStrategy } from './PreviewStrategy';

export class TextPreviewStrategy implements PreviewStrategy {
    canHandle(fileType: string, fileName: string): boolean {
      return fileType === 'text/plain' || fileName.endsWith('.txt');
    }
  
    async preview(file: File | string): Promise<void> {
      if (typeof file === 'string') {
        window.open(file, '_blank');
        return;
      }
  
      const text = await file.text();
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      if (win) {
        win.onload = () => URL.revokeObjectURL(url);
      }
    }
  }