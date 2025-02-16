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
  const { handleFileRemove, handleFileRename, handlePreviewFile, handleDownloadFile } = useFileOperations();

  const handleSave = () => {
    handleFileRename(index, newName);
    setIsEditing(false);
  };

  const getProgressStatus = () => {
    if (file.progress === 'ERROR') return 'exception';
    if (file.progress === 'COMPLETE') return 'success';
    return 'active';
  };

  return (
    <Card className="file-item">
      <div className="file-item-content">
        <div className="file-item-info">
          <FileIcon
            fileName={file.file.name}
            className="file-icon"
          />
          <div className="file-details">
          <div className="file-size">
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
            {isEditing ? (
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={handleSave}
                onPressEnter={handleSave}
                className="file-name-input"
              />
            ) : (
              <div className="file-name">
                {file.renamed || file.file.name}
              </div>
            )}
            <div className="file-size">
              {formatFileSize(file.file.size)}
            </div>
            {typeof file.progress === 'number' && (
              <Progress
                percent={Math.round(file.progress)}
                size="small"
                status={getProgressStatus()}
                className="progress-bar"
              />
            )}
          </div>
        </div>

        <div className="files-actions">
          <ActionButton
            icon={<EditOutlined />}
            onClick={() => setIsEditing(true)}
            tooltip="Renommer"
            disabled={typeof file.progress === 'number'}
            className="action-button"
          />
          <ActionButton
            icon={<EyeOutlined />}
            onClick={() => handlePreviewFile(file)}
            tooltip="Aperçu"
            disabled={!file.url}
            className="action-button"
          />
          <ActionButton
            icon={<DownloadOutlined />}
            onClick={() => handleDownloadFile(file)}
            tooltip="Télécharger"
            disabled={typeof file.progress === 'number'}
            className="action-button"
          />
          <Divider type="vertical" className="action-button" />
          <ActionButton
            icon={<DeleteOutlined />}
            onClick={() => handleFileRemove(index)}
            tooltip="Supprimer"
            className="action-button-danger"
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