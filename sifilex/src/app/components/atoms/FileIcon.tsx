import React from 'react';
import { FileOutlined, FilePdfOutlined, FileTextOutlined, FileWordOutlined, FileImageOutlined } from '@ant-design/icons';

export interface FileIconProps {
  fileName: string;
  className?: string;
}

export const FileIcon: React.FC<FileIconProps> = ({ fileName, className }) => {
  switch (true) {
    case /\.pdf$/i.test(fileName):
      return <FilePdfOutlined className={className} />;
    case /\.(doc|docx)$/i.test(fileName):
      return <FileWordOutlined className={className} />;
    case /\.(txt|md)$/i.test(fileName):
      return <FileTextOutlined className={className} />;
    case /\.(jpg|jpeg|png|gif|svg)$/i.test(fileName):
      return <FileImageOutlined className={className} />;
    default:
      return <FileOutlined className={className} />;
  }
};
