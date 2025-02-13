"use client";

import { Upload, Button, message, UploadProps } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import { useEdgeStore } from "@/lib/edgestore";

const SingleImageDropzone = ({
  width,
  height,
  value,
  onChange,
  disabled,
  dropzoneOptions
}: {
  width: number;
  height: number;
  value?: File | string;
  onChange?: (file?: File) => void;
  disabled?: boolean;
  dropzoneOptions?: Omit<DropzoneOptions, 'disabled'>;
}) => {
  const [progress, setProgress] = useState(0);
  const [urls, setUrls] = useState<{
    url: string;
    thumbnailUrl: string | null;
  }>();
  const { edgestore } = useEdgeStore();

  const handleUpload = async (file: File) => {
    if (file) {
      const res = await edgestore.myPublicImages.upload({
        file,
        input: { type: "post" },
        onProgressChange: (progress: number) => {
          setProgress(progress);
        },
      });
      setUrls({
        url: res.url,
        thumbnailUrl: res.thumbnailUrl,
      });
    }
  };

  const handleRemove = () => {
    onChange?.(undefined);
    setUrls(undefined);
  };

  const handleDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      onChange?.(file);
      handleUpload(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
   
    multiple: false,
    disabled,
    onDrop: handleDrop,
    ...dropzoneOptions,
  });

  return (
    <div style={{ width, height }} className="dropzone-container">
      <div
        {...getRootProps()}
        className="dropzone"
      >
        <input {...getInputProps()} />
        {value ? (
          <img
            className="image-preview"
            src={typeof value === 'string' ? value : URL.createObjectURL(value)}
            alt="Uploaded"
          />
        ) : (
          <div className="upload-message">
            <UploadOutlined className="upload-icon" />
            <div>drag & drop to upload</div>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              disabled={disabled}
              className="mt-3"
            >
              Select
            </Button>
          </div>
        )}
      </div>

      {value && !disabled && (
        <Button
          icon={<DeleteOutlined />}
          onClick={handleRemove}
          className="mt-2"
          danger
        >
          Remove Image
        </Button>
      )}

      <div className="progress-bar">
        <div
          className="progress-bar-inner"
          style={{ width: `${progress}%` }}
        />
      </div>

      {urls?.url && (
        <div className="image-link">
          <a href={urls.url} target="_blank" rel="noopener noreferrer">
            View Image
          </a>
        </div>
      )}
      {urls?.thumbnailUrl && (
        <div className="thumbnail-link">
          <a href={urls.thumbnailUrl} target="_blank" rel="noopener noreferrer">
            View Thumbnail
          </a>
        </div>
      )}
    </div>
  );
};

export default SingleImageDropzone;
