"use client";

import {
  MultiFileDropzone,
  type FileState,
} from "../src/app/components/multi-file-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { useState } from "react";
import { DownloadOutlined } from "@ant-design/icons"; // Icône Ant Design

import { Button, Space } from "antd"; // Composants Ant Design pour les boutons et espaces

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
