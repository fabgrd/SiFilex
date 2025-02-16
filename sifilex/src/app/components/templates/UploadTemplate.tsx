import React from "react";
import { Card } from "antd";
import { ArrowDownOutlined } from "@ant-design/icons";
import { FileUploader } from "@/app/components/organisms/FileUploader";
import { FileOperationsProvider } from "@/app/lib/context/FileOperationsContext";

interface UploadTemplateProps {
  maxFiles?: number;
  maxSize?: number;
  acceptedFileTypes?: string[];
}

export const UploadTemplate: React.FC<UploadTemplateProps> = (props) => {
  return (
    <div className="upload-container">
      <Card
        title={
          <span className="upload-title">
            <ArrowDownOutlined className="upload-icon" />
           Déposez vos fichiers ici
          </span>
        }
        className="upload-card"
      >
        <FileOperationsProvider>
          <FileUploader {...props} />
        </FileOperationsProvider>
      </Card>
    </div>
  );
};
