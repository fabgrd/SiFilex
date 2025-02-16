import React, { useState } from 'react';
import { Input, Space, Tooltip, Progress, Card, Divider } from 'antd'; // Ajout de Card et Divider
import { EditOutlined, DeleteOutlined, EyeOutlined, DownloadOutlined, CloudUploadOutlined, WarningOutlined } from '@ant-design/icons';
import { FileIcon } from '@/app/components/atoms/FileIcon';
import { ActionButton } from '@/app/components/atoms/ActionButton';
import { useFileOperations } from '@/app/lib/hooks/useFileOperations';
import { FileState } from '@/app/lib/utils/types';
import { formatFileSize } from '@/app/lib/utils/fileUtils';

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

  const handleDownload = () => {
    if (file.url) {
      window.open(file.url, '_blank');
    }
  };

  const getProgressStatus = () => {
    if (file.progress === 'ERROR') return 'exception';
    if (file.progress === 'COMPLETE') return 'success';
    return 'active';
  };

  return (
    <Card
      className="mb-4 shadow-sm hover:shadow-md transition-shadow"
      bodyStyle={{ padding: '12px' }}
    >
      <div className="flex justify-between items-start">
        {/* Côté gauche - Informations du fichier */}
        <div className="flex items-start space-x-3">
          <div className="pt-1">
            <FileIcon
              fileName={file.file.name}
              className="text-4xl text-blue-500"
            />
          </div>
          <div className="flex flex-col min-w-0">
            {isEditing ? (
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={handleSave}
                onPressEnter={handleSave}
                className="w-48"
              />
            ) : (
              <div className="font-medium text-gray-800 truncate max-w-xs">
                {file.renamed || file.file.name}
              </div>
            )}
            <div className="text-sm text-gray-500 mt-1">
              {formatFileSize(file.file.size)}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {file.metadata?.uploadedAt
                ? new Date(file.metadata.uploadedAt).toLocaleString('fr-FR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
                : 'Date inconnue'}
            </div>
            {typeof file.progress === 'number' && (
              <div className="mt-2 w-48">
                <Progress
                  percent={Math.round(file.progress)}
                  size="small"
                  status={getProgressStatus()}
                  showInfo={true}
                />
              </div>
            )}
          </div>
        </div>

        {/* Côté droit - Actions */}
        <div className="flex items-center space-x-1">
          <ActionButton
            icon={<EditOutlined />}
            onClick={() => setIsEditing(true)}
            tooltip="Renommer"
            disabled={typeof file.progress === 'number'}
          />
          <ActionButton
            icon={<EyeOutlined />}
            onClick={() => handlePreviewFile(file)}
            tooltip="Aperçu"
            disabled={!file.url}
          />
          <ActionButton
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            tooltip="Télécharger"
            disabled={!file.url}
          />
          <Divider type="vertical" className="h-6 bg-gray-200" />
          <ActionButton
            icon={<DeleteOutlined />}
            onClick={() => handleFileRemove(index)}
            tooltip="Supprimer"
            className="text-red-500 hover:text-red-700"
            disabled={typeof file.progress === 'number'}
          />
        </div>
      </div>

      {file.error && (
        <div className="mt-2 text-red-500 text-sm">
          {file.error}
        </div>
      )}
    </Card>
  );
};