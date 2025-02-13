import React from 'react';
import { Card } from 'antd';
import { FileUploader } from '@/app/components/organisms/FileUploader';
import { FileOperationsProvider } from '@/app/lib/context/FileOperationsContext';

interface UploadTemplateProps {
  maxFiles?: number;
  maxSize?: number;
  acceptedFileTypes?: string[];
}

export const UploadTemplate: React.FC<UploadTemplateProps> = (props) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card title="File Upload">
        <FileOperationsProvider>
          <FileUploader {...props} />
        </FileOperationsProvider>
      </Card>
    </div>
  );
};