"use client";

import {
  UploadOutlined,
  DeleteOutlined,
  FileOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import * as React from "react";
import { Upload, message } from "antd";
import { DropzoneOptions, useDropzone } from "react-dropzone";

export type FileState = {
  file: File;
  key: string;
  progress: "PENDING" | "COMPLETE" | "ERROR" | number;
};

type InputProps = {
  value?: FileState[];
  onChange?: (files: FileState[]) => void | Promise<void>;
  onFilesAdded?: (addedFiles: FileState[]) => void | Promise<void>;
  disabled?: boolean;
  dropzoneOptions?: Omit<DropzoneOptions, "disabled">;
};

const ERROR_MESSAGES = {
  fileTooLarge(maxSize: number) {
    return `The file is too large. Max size is ${formatFileSize(maxSize)}.`;
  },
  fileInvalidType() {
    return "Invalid file type.";
  },
  tooManyFiles(maxFiles: number) {
    return `You can only add ${maxFiles} file(s).`;
  },
  fileNotSupported() {
    return "The file is not supported.";
  },
};

const MultiFileDropzone = React.forwardRef<HTMLInputElement, InputProps>(
  ({ dropzoneOptions, value, disabled, onFilesAdded, onChange }, ref) => {
    const [customError, setCustomError] = React.useState<string>();

    if (dropzoneOptions?.maxFiles && value?.length) {
      disabled = disabled ?? value.length >= dropzoneOptions.maxFiles;
    }

    const {
      getRootProps,
      getInputProps,
      fileRejections,
      isDragAccept,
      isDragReject,
    } = useDropzone({
      disabled,
      onDrop: (acceptedFiles) => {
        setCustomError(undefined);
        if (
          dropzoneOptions?.maxFiles &&
          (value?.length ?? 0) + acceptedFiles.length > dropzoneOptions.maxFiles
        ) {
          setCustomError(ERROR_MESSAGES.tooManyFiles(dropzoneOptions.maxFiles));
          return;
        }
        const addedFiles = acceptedFiles.map<FileState>((file) => ({
          file,
          key: Math.random().toString(36).slice(2),
          progress: "PENDING",
        }));
        void onFilesAdded?.(addedFiles);
        void onChange?.([...(value ?? []), ...addedFiles]);
      },
      ...dropzoneOptions,
    });

    const errorMessage = React.useMemo(() => {
      if (fileRejections[0]) {
        const { errors } = fileRejections[0];
        if (errors[0]?.code === "file-too-large") {
          return ERROR_MESSAGES.fileTooLarge(dropzoneOptions?.maxSize ?? 0);
        } else if (errors[0]?.code === "file-invalid-type") {
          return ERROR_MESSAGES.fileInvalidType();
        } else if (errors[0]?.code === "too-many-files") {
          return ERROR_MESSAGES.tooManyFiles(dropzoneOptions?.maxFiles ?? 0);
        } else {
          return ERROR_MESSAGES.fileNotSupported();
        }
      }
      return undefined;
    }, [fileRejections, dropzoneOptions]);

    return (
      <div className="dropzone-container">
        <div
          {...getRootProps({
            className: "dropzone",
            style: {
              backgroundColor: isDragReject ? "#ffccc7" : isDragAccept ? "#013122" : "#000000",
            },
          })}
        >
          <input ref={ref} {...getInputProps()} />
          <UploadOutlined className="upload-icon" />
          <p className="upload-message">Drag & drop or click to upload</p>
        </div>
        {customError || errorMessage ? (
          <p style={{ color: "red", fontSize: "12px" }}>{customError ?? errorMessage}</p>
        ) : null}

        {value?.map(({ file, progress }, i) => (
          <div key={i} className="image-preview mt-2">
            <FileOutlined className="upload- mt-2" />
            <div>
              <div>{file.name}</div>
              <div style={{ fontSize: "12px", color: "#8c8c8c" }}>{formatFileSize(file.size)}</div>
            </div>
            {progress === "PENDING" ? (
              <DeleteOutlined
                style={{ color: "red", cursor: "pointer" }}
                onClick={() => void onChange?.(value.filter((_, index) => index !== i))}
              />
            ) : progress === "ERROR" ? (
              <ExclamationCircleOutlined style={{ color: "red" }} />
            ) : progress !== "COMPLETE" ? (
              <span>{Math.round(progress)}%</span>
            ) : (
              <CheckCircleOutlined style={{ color: "green" }} />
            )}
          </div>
        ))}
      </div>
    );
  }
);
MultiFileDropzone.displayName = "MultiFileDropzone";

function formatFileSize(bytes?: number) {
  if (!bytes) return "0 Bytes";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

export { MultiFileDropzone };
