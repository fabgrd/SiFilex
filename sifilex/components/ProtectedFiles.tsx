"use client";

import { MultiFileDropzone, type FileState } from "../src/app/components/MultiFileDropzone/MultiFileDropzone";
import { UploadTemplate } from '@/app/components/templates/UploadTemplate';
import { useEdgeStore } from "@/lib/edgestore";
import { useState } from "react";
import { DownloadOutlined } from "@ant-design/icons";

import { Button, Space } from "antd";

export default function Page() {
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const { edgestore } = useEdgeStore();

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  return (
    <div className="p-4">
      <UploadTemplate
        maxFiles={5}
        maxSize={5 * 1024 * 1024} // 5MB
        acceptedFileTypes={[
          'image/*',
          'application/pdf',
          '.doc,.docx',
          '.txt'
        ]}
      />
      <MultiFileDropzone
        value={fileStates}
        onChange={(files) => {
          setFileStates(files);
        }}
        onFilesAdded={async (addedFiles) => {
          setFileStates([...fileStates, ...addedFiles]);
          await Promise.all(
            addedFiles.map(async (addedFileState) => {
              try {
                const res = await edgestore.myProtectedFiles.upload({
                  file: addedFileState.file,
                  onProgressChange: async (progress) => {
                    updateFileProgress(addedFileState.key, progress);
                    if (progress === 100) {
                      // wait 1 second to set it to complete
                      // so that the user can see the progress bar at 100%
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      updateFileProgress(addedFileState.key, "COMPLETE");
                    }
                  },
                });
                setUrls([...urls, res.url]);
                console.log(res);
              } catch (err) {
                updateFileProgress(addedFileState.key, "ERROR");
              }
            })
          );
        }}
        dropzoneOptions={{
          maxFiles: 10,
          maxSize: 15 * 1024 * 1024, // Limite la taille à 15 Mo
        }}
      />
      <div className="mt-4">
        {fileStates.map((fileState, index) => (
          <div key={index} className="flex items-center space-x-2">
            <DownloadOutlined /> {/* Icône de téléchargement */}
            <span>{fileState.file.name}</span>
            <Space>
              <Button
                type="link"
                href={urls[index]}
                target="_blank"
                icon={<DownloadOutlined />}
              >
                Télécharger
              </Button>
            </Space>
          </div>
        ))}
      </div>
    </div>
  );
}
