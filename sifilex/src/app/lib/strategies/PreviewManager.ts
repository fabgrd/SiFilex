import { PreviewStrategy } from './PreviewStrategy';
import { TextPreviewStrategy } from './TextPreviewStrategy';
import { MarkdownPreviewStrategy } from './MarkdownPreviewStrategy';
import { PDFPreviewStrategy } from './PDFPreviewStrategy';
import { DefaultPreviewStrategy } from './DefaultPreviewStrategy';

export class PreviewManager {
  private strategies: PreviewStrategy[];
  private defaultStrategy: PreviewStrategy;

  constructor() {
    this.strategies = [
      new TextPreviewStrategy(),
      new MarkdownPreviewStrategy(),
      new PDFPreviewStrategy(),
    ];
    this.defaultStrategy = new DefaultPreviewStrategy();
  }

  async previewFile(file: File | string): Promise<void> {
    if (typeof file === 'string') {
      this.defaultStrategy.preview(file);
      return;
    }

    const strategy = this.strategies.find(s => 
      s.canHandle(file.type, file.name)
    ) || this.defaultStrategy;

    await strategy.preview(file);
  }
}