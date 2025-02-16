import React from "react";
import { Card } from "antd";
import { FileProtectOutlined } from "@ant-design/icons";
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
           Bienvenue sur SiFilex, votre plateforme de gestion de fichiers sécurisée
            <FileProtectOutlined className="upload-icon" />
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
