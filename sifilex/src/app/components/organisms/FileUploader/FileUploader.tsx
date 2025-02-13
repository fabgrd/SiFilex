// src/components/organisms/FileUploader/FileUploader.tsx
import React, { useState } from 'react';
import { Alert } from 'antd';
import { FileState } from '@/app/lib/utils/types';
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
  const { files, addFiles, error } = useFileOperations();

  const filteredFiles = files.filter(file => 
    (file.renamed || file.file.name)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const totalSize = files.reduce((sum, file) => sum + file.file.size, 0);

  return (
    <div className="space-y-4">
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        className="mb-4"
      />

      <DropzoneArea
        options={{
          maxFiles,
          maxSize,
          accept: acceptedFileTypes
        }}
        disabled={maxFiles ? files.length >= maxFiles : false}
        onDrop={addFiles}
      />

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          className="mt-4"
        />
      )}

      <div className="mt-6 space-y-2">
        {filteredFiles.map((file, index) => (
          <FileItem
            key={file.key}
            file={file}
            index={index}
          />
        ))}
      </div>

      <div className="text-right text-gray-500 text-sm">
        Total Storage Used: {formatFileSize(totalSize)}
      </div>
    </div>
  );
};