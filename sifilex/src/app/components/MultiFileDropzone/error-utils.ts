import { FileRejection } from 'react-dropzone';

export const ERROR_MESSAGES = {
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

export function formatFileSize(bytes?: number) {
  if (!bytes) return "0 Bytes";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

export function getErrorMessage(
  fileRejections: readonly FileRejection[],
  dropzoneOptions?: { maxSize?: number; maxFiles?: number }
) {
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
}