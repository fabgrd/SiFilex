import React, { useState } from 'react';
import { Input, Space } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import { FileIcon } from '@/app/components/atoms/FileIcon';
import { ActionButton } from '@/app/components/atoms/ActionButton';
import { ProgressBar } from '@/app/components/atoms/ProgressBar';
import { useFileOperations } from '@/app/lib/hooks/useFileOperations';
import { FileState } from '@/app/lib/utils/types';

export interface FileItemProps {
  file: FileState;
  index: number;
}

export const FileItem: React.FC<FileItemProps> = ({ file, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(file.renamed || file.file.name);
  const { handleFileRemove, handleFileRename, handlePreviewFile } = useFileOperations();

  const handleSave = () => {
    handleFileRename(index, newName);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <Space>
        <FileIcon fileName={file.file.name} />
        <div>
          {isEditing ? (
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleSave}
              onPressEnter={handleSave}
              className="w-48"
            />
          ) : (
            <span className="font-medium">{file.renamed || file.file.name}</span>
          )}
        </div>
      </Space>

      <Space>
        {typeof file.progress === 'number' && <ProgressBar progress={file.progress} />}
        
        <ActionButton
          icon={<EditOutlined />}
          onClick={() => setIsEditing(true)}
          tooltip="Rename"
        />
        
        <ActionButton
          icon={<EyeOutlined />}
          onClick={() => handlePreviewFile(file.file)}
          tooltip="Preview"
        />
        
        <ActionButton
          icon={<DownloadOutlined />}
          onClick={() => {
            const url = URL.createObjectURL(file.file);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.renamed || file.file.name;
            a.click();
            URL.revokeObjectURL(url);
          }}
          tooltip="Download"
        />
        
        <ActionButton
          icon={<DeleteOutlined />}
          onClick={() => handleFileRemove(index)}
          tooltip="Delete"
          className="text-red-500"
        />
      </Space>
    </div>
  );
};