import { DeleteOutlined, ExclamationCircleOutlined, CheckCircleOutlined, EyeOutlined, DownloadOutlined } from "@ant-design/icons";
import { FileState } from "./MultiFileDropzone";

interface ProgressIndicatorProps {
  fileState: FileState;
  index: number;
  onRemove: (index: number) => void;
  onPreview: (file: File) => void;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  fileState: { file, progress },
  index,
  onRemove,
  onPreview
}) => {
  if (progress === "PENDING") {
    return (
      <DeleteOutlined
        style={{ color: "red", cursor: "pointer" }}
        onClick={() => onRemove(index)}
      />
    );
  }

  if (progress === "ERROR") {
    return <ExclamationCircleOutlined style={{ color: "red" }} />;
  }

  if (progress !== "COMPLETE") {
    return <span>{Math.round(progress as number)}%</span>;
  }

  return (
    <>
      <CheckCircleOutlined style={{ color: "green" }} />
      <DeleteOutlined
        style={{ color: "red", cursor: "pointer", marginLeft: 10 }}
        onClick={() => onRemove(index)}
      />
      <EyeOutlined
        style={{ cursor: "pointer", color: "#1890ff", marginLeft: 10 }}
        onClick={() => onPreview(file)}
      />
      <a href={URL.createObjectURL(file)} download={file.name}>
        <DownloadOutlined style={{ cursor: "pointer", marginLeft: 10 }} />
      </a>
    </>
  );
};
