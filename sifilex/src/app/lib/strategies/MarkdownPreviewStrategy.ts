import { PreviewStrategy } from './PreviewStrategy';

export class MarkdownPreviewStrategy implements PreviewStrategy {
    canHandle(fileType: string, fileName: string): boolean {
      return fileType === 'text/markdown' || fileName.endsWith('.md');
    }
  
    async preview(file: File | string): Promise<void> {
      if (typeof file === 'string') {
        window.open(file, '_blank');
        return;
      }
  
      const text = await file.text();
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Markdown Preview</title>
            <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/github-markdown-css/github-markdown.css">
            <style>
              .markdown-body {
                box-sizing: border-box;
                min-width: 200px;
                max-width: 980px;
                margin: 0 auto;
                padding: 45px;
              }
            </style>
          </head>
          <body class="markdown-body">
            <div id="content"></div>
            <script>
              document.getElementById('content').innerHTML = marked.parse(\`${text.replace(/`/g, '\\`')}\`);
            </script>
          </body>
        </html>
      `;
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      if (win) {
        win.onload = () => URL.revokeObjectURL(url);
      }
    }
  }