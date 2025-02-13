import {
  UploadOutlined,
  DeleteOutlined,
  FileOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  EyeOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useState, forwardRef, useMemo } from "react";
import { Upload, message } from "antd";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import { formatFileSize, getErrorMessage } from "./errorUtils";
import {
  handlePreviewFile,
  createFileState,
  calculateTotalStorageUsed,
  filterFilesByName,
  handleFileRename,
  handleFileRemove,
  checkMaxFilesLimit,
} from "./file-operations";
import { ProgressIndicator } from "./ProgressIndicator";

export type FileState = {
  file: File;
  key: string;
  progress: "PENDING" | "COMPLETE" | "ERROR" | number;
  renamed?: string;
};

type InputProps = {
  value?: FileState[];
  onChange?: (files: FileState[]) => void | Promise<void>;
  onFilesAdded?: (addedFiles: FileState[]) => void | Promise<void>;
  disabled?: boolean;
  dropzoneOptions?: Omit<DropzoneOptions, "disabled">;
};

const MultiFileDropzone = forwardRef<HTMLInputElement, InputProps>(
  ({ dropzoneOptions, value, disabled, onFilesAdded, onChange }, ref) => {
    const [customError, setCustomError] = useState<string>();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [newName, setNewName] = useState<string>("");

    const filteredFiles = useMemo(
      () => filterFilesByName(value, searchQuery),
      [value, searchQuery]
    );

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
        if (checkMaxFilesLimit(value?.length ?? 0, acceptedFiles.length, dropzoneOptions?.maxFiles)) {
          setCustomError(`You can only add ${dropzoneOptions?.maxFiles} file(s).`);
          return;
        }
        const addedFiles = acceptedFiles.map(createFileState);
        void onFilesAdded?.(addedFiles);
        void onChange?.([...(value ?? []), ...addedFiles]);
      },
      ...dropzoneOptions,
    });

    const errorMessage = useMemo(
      () => getErrorMessage(fileRejections, dropzoneOptions),
      [fileRejections, dropzoneOptions]
    );

    const handleEditClick = (index: number, currentName: string) => {
      setEditingIndex(index);
      setNewName(currentName);
    };

    const handleSaveRename = (index: number) => {
      const updatedFiles = handleFileRename(value ?? [], index, newName);
      onChange?.(updatedFiles);
      setEditingIndex(null);
      setNewName("");
    };

    const totalStorageUsed = useMemo(
      () => calculateTotalStorageUsed(value),
      [value]
    );

    return (
      <div className="dropzone-container">
        <input
          type="text"
          placeholder="Rechercher par nom de fichier"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: "8px", width: "100%", marginBottom: "15px" }}
        />
        <div
          {...getRootProps({
            className: "dropzone",
            style: {
              backgroundColor: isDragReject ? "#ffccc7" : isDragAccept ? "#013122" : "#000000",
            },
          })}
        >
          <input ref={ref} {...getInputProps()} />
          <p>Drag & drop or click to upload</p>
          
          <UploadOutlined className="upload-icon" />
        </div>
        {/* trouver un toast pour afficher les erreurs ANT D */}
        {customError || errorMessage ? (
          <p style={{ color: "red", fontSize: "12px" }}>{customError ?? errorMessage}</p>
        ) : null}

        {filteredFiles?.map(({ file, progress, renamed }, i) => (
          <div key={i} className="file-preview mt-2">
            <FileOutlined className="file-icon" />
            <div>
              {progress === "COMPLETE" && (
                <div>
                  <div style={{ display: "inline-block", marginRight: 10 }}>
                    {editingIndex === i ? (
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onBlur={() => handleSaveRename(i)}
                        onKeyPress={(e) => e.key === "Enter" && handleSaveRename(i)}
                        style={{ fontSize: "12px", padding: "2px" }}
                      />
                    ) : (
                      renamed || file.name
                    )}
                  </div>
                  <EditOutlined
                    onClick={() => handleEditClick(i, renamed || file.name)}
                    style={{ cursor: "pointer", color: "#1890ff" }}
                  />
                </div>
              )}
              <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                {formatFileSize(file.size)}
              </div>
            </div>
            {/* Voir comment améliore le SRP ---- éviter props drilling */}
            <ProgressIndicator fileState={filteredFiles[i]} index={i} onRemove={() => handleFileRemove(value ?? [], i)} onPreview={() => handlePreviewFile(file)} />

          </div>
        ))}
        
        <div style={{ marginTop: "20px", fontSize: "14px", color: "#555" }}>
          Total Storage Used: {formatFileSize(totalStorageUsed)}
        </div>
      </div>
    );
  }
);

MultiFileDropzone.displayName = "MultiFileDropzone";

export { MultiFileDropzone };