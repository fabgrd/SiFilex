import { useDropzone, DropzoneOptions } from 'react-dropzone';
import { useCallback } from 'react';

export const useDropzoneConfig = (options: DropzoneOptions) => {
  const onDrop = useCallback(options.onDrop, [options.onDrop]);

  return useDropzone({
    ...options,
    onDrop,
  });
};