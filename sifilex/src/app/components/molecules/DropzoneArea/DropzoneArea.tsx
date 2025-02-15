import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Upload, message } from 'antd';
import type { UploadProps } from 'antd';

export interface DropzoneAreaProps {
  options?: {
    maxFiles?: number;
    maxSize?: number;
    accept?: string[];
  };
  disabled?: boolean;
  onDrop: (files: File[]) => void;
}

export const DropzoneArea: React.FC<DropzoneAreaProps> = ({ options, disabled = false, onDrop }) => {
  const { maxFiles, maxSize, accept } = options || {};

  const props: UploadProps = {
    name: 'file',
    multiple: maxFiles ? maxFiles > 1 : true,
    showUploadList: false,
    accept: accept?.join(','), // Convertit le tableau de types acceptés en string
    beforeUpload: (file) => {
      if (maxSize && file.size > maxSize) {
        message.error(`${file.name} is too large. Max size: ${maxSize / 1024 / 1024}MB.`);
        return false;
      }
      onDrop([file]);
      return false; // Empêche l'upload automatique
    },
    onDrop(e) {
      const droppedFiles = Array.from(e.dataTransfer.files);

      if (maxFiles && droppedFiles.length > maxFiles) {
        message.error(`You can only upload up to ${maxFiles} files.`);
        return;
      }

      const validFiles = maxSize
        ? droppedFiles.filter(file => file.size <= maxSize)
        : droppedFiles;

      if (validFiles.length > 0) {
        onDrop(validFiles);
      } else {
        message.error('All selected files exceed the maximum size limit.');
      }
    },
    disabled,
  };

  return (
    <Upload.Dragger {...props} className={disabled ? 'opacity-50 cursor-not-allowed' : ''}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag file to this area to upload</p>
      <p className="ant-upload-hint">
        {maxFiles ? `You can upload up to ${maxFiles} file(s).` : 'Supports multiple file uploads.'}
      </p>
    </Upload.Dragger>
  );
};
