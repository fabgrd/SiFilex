import { FileState } from './multi-file-dropzone';

export function handlePreviewFile(file: File) {
  const fileType = file.type;
  const fileUrl = URL.createObjectURL(file);

  if (fileType.startsWith("text") || file.name.endsWith(".md")) {
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      alert(`File content: \n${content}`);
    };
    reader.readAsText(file);
  } else if (fileType === "application/pdf") {
    window.open(fileUrl, "_blank");
  } else {
    alert("File type not supported for preview.");
  }
}

export function createFileState(file: File): FileState {
  return {
    file,
    key: Math.random().toString(36).slice(2),
    progress: "PENDING",
  };
}

export function calculateTotalStorageUsed(files: FileState[] = []): number {
  return files.reduce((total, { file }) => total + file.size, 0);
}

export function filterFilesByName(files: FileState[] = [], searchQuery: string): FileState[] {
  return files.filter(({ file, renamed }) => {
    const fileName = renamed || file.name;
    return fileName.toLowerCase().includes(searchQuery.toLowerCase());
  });
}

export function handleFileRename(
  files: FileState[],
  index: number,
  newName: string
): FileState[] {
  const updatedFiles = [...files];
  updatedFiles[index] = {
    ...updatedFiles[index],
    renamed: newName,
  };
  return updatedFiles;
}

export function handleFileRemove(
  files: FileState[],
  index: number
): FileState[] {
  return files.filter((_, i) => i !== index);
}

export function checkMaxFilesLimit(
  currentLength: number,
  addedLength: number,
  maxFiles?: number
): boolean {
  if (!maxFiles) return false;
  return currentLength + addedLength > maxFiles;
}