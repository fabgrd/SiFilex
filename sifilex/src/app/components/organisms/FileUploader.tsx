import React, { useState } from 'react';
import { Alert, Spin } from 'antd';
import { SearchInput } from '@/app/components/molecules/SearchInput';
import { DropzoneArea } from '@/app/components/molecules/DropzoneArea';
import { FileItem } from '@/app/components/molecules/FileItem';
import { useFileOperations } from '@/app/lib/hooks/useFileOperations';
import { formatFileSize } from '@/app/lib/utils/fileUtils';

export interface FileUploaderProps {
  maxFiles?: number;
  maxSize?: number;
  acceptedFileTypes?: string[];
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  maxFiles,
  maxSize,
  acceptedFileTypes
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { files, addFiles, error, loading } = useFileOperations();
  const [localError, setLocalError] = useState<string | null>(null);

  const filteredFiles = searchQuery
  ? files.filter(file => {
      const fileName = file.renamed || file.file?.name || '';
      return fileName.toLowerCase().includes(searchQuery.toLowerCase());
    })
  : files;

  const totalSize = files.reduce((sum, file) => sum + (file.file.size || 0), 0);

  if (loading) {
    return (
      <div className="">
        <Spin size="large" tip="Loading files..." />
      </div>
    );
  }

  return (
    <div>
      <div>
        <DropzoneArea
          options={{
            maxFiles,
            maxSize,
            accept: acceptedFileTypes
          }}
          disabled={maxFiles ? files.length >= maxFiles : false}
          onDrop={addFiles}
        />
      </div>

      {error && (
        <Alert
        message="Erreur"
        description={error}
        type="error"
        showIcon
        closable
        className="my-4"
        />
      )}

      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        className="mb-4"
      />
      
        {filteredFiles.map((file, index) => (
          <FileItem
            key={file.key}
            file={file}
            index={index}
          />
        ))}

      {files.length > 0 && (
        <div className="total-size">
          Espace total utilisé : {formatFileSize(totalSize)}
        </div>
      )}
    </div>
  );
};