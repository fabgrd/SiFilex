import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Upload, message } from 'antd';
import type { UploadProps } from 'antd';

export interface DropzoneAreaProps {
  multiple?: boolean;
  disabled?: boolean;
  onDrop: (files: File[]) => void;
}

export const DropzoneArea: React.FC<DropzoneAreaProps> = ({ multiple = true, disabled = false, onDrop }) => {
  const props: UploadProps = {
    name: 'file',
    multiple,
    showUploadList: false,
    beforeUpload: (file) => {
      onDrop([file]);
      return false; // Prevent auto upload
    },
    onChange(info) {
      const { status, name } = info.file;
      if (status === 'done') {
        message.success(`${name} uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${name} upload failed.`);
      }
    },
    onDrop(e) {
      onDrop(Array.from(e.dataTransfer.files));
    },
    disabled,
  };

  return (
    <Upload.Dragger {...props} className={disabled ? 'opacity-50 cursor-not-allowed' : ''}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag file to this area to upload</p>
      <p className="ant-upload-hint">Supports single or multiple file uploads.</p>
    </Upload.Dragger>
  );
};

