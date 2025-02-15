import React from 'react';
import { FileOutlined, FilePdfOutlined, FileTextOutlined, FileWordOutlined, FileImageOutlined } from '@ant-design/icons';

export interface FileIconProps {
  fileName: string;
  className?: string;
}

export const FileIcon: React.FC<FileIconProps> = ({ fileName, className }) => {
  switch (true) {
    case fileName.endsWith('.pdf'):
      return <FilePdfOutlined className={className} />;
    case /\.(doc|docx)$/.test(fileName):
      return <FileWordOutlined className={className} />;
    case /\.(txt|md)$/.test(fileName):
      return <FileTextOutlined className={className} />;
    case /\.(jpg|jpeg|png|gif)$/.test(fileName):
      return <FileImageOutlined className={className} />;
    default:
      return <FileOutlined className={className} />;
  }
};