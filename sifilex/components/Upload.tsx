'use client';

import SingleImageDropzone from "../src/app/components/single-image-dropzone";
import { MultiFileDropzone } from "@/app/components/multi-file-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import Link from "next/link";
import { useState } from "react";
import { Button, Progress, Space, Typography } from "antd";

const { Text } = Typography;

export default function Page() {
  const [file, setFile] = useState<File>();
  const [progress, setProgress] = useState(0);
  const [urls, setUrls] = useState<{
    url: string;
    thumbnailUrl: string | null;
  }>();
  const { edgestore } = useEdgeStore();

  return (
    <div style={containerStyle}>
      <SingleImageDropzone
        width={200}
        height={200}
        value={file}
        dropzoneOptions={{
          maxSize: 1024 * 1024 * 1, // 1MB
        }}
        onChange={(file) => {
          setFile(file);
        }}
      />

      <MultiFileDropzone
        value={[]}
        onChange={(files) => {
          console.log(files);
        }}
        dropzoneOptions={{
          maxFiles: 3,
          maxSize: 1024 * 1024 * 1, // 1MB
        }}
        />
      
      
      <Progress
        percent={progress}
        showInfo={false}
        strokeColor="#1890ff"
        style={{ width: 220, marginTop: '16px' }}
      />
      
      {/* <Button
        type="primary"
        onClick={async () => {
          if (file) {
            const res = await edgestore.myPublicImages.upload({
              file,
              input: { type: "post" },
              onProgressChange: (progress) => {
                setProgress(progress);
              },
            });
            // Save your data here
            setUrls({
              url: res.url,
              thumbnailUrl: res.thumbnailUrl,
            });
          }
        }}
        style={{ marginTop: '16px' }}
      >
        Upload
      </Button> */}

      {urls?.url && (
        <Space style={{ marginTop: '16px' }}>
          <Text strong>URL:</Text>
          <Link href={urls.url} target="_blank">
            {urls.url}
          </Link>
        </Space>
      )}

      {urls?.thumbnailUrl && (
        <Space style={{ marginTop: '8px' }}>
          <Text strong>THUMBNAIL:</Text>
          <Link href={urls.thumbnailUrl} target="_blank">
            {urls.thumbnailUrl}
          </Link>
        </Space>
      )}
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '24px',
  gap: '16px',
};
