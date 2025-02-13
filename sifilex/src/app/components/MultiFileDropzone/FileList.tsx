import React, { useState } from 'react';
import { Progress, Typography, Space, Input, Tooltip } from 'antd';
import {
    FileOutlined,
    FilePdfOutlined,
    FileWordOutlined,
    FileImageOutlined,
    DeleteOutlined,
    CheckCircleFilled,
    FileTextOutlined,
    EditOutlined,
    EyeOutlined,
    DownloadOutlined,
} from '@ant-design/icons';
import { FileState } from './MultiFileDropzone';

const { Text } = Typography;

export interface FileListProps {
    files: FileState[];
    onRemove: (index: number) => void;
    onRename: (index: number, newName: string) => void;
    onPreview: (file: File) => void;
}

const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.pdf')) return <FilePdfOutlined />;
    if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) return <FileWordOutlined />;
    if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png') || fileName.endsWith('.svg')) return <FileImageOutlined />;
    if (fileName.endsWith('.txt') || fileName.endsWith('.md')) return <FileTextOutlined />;
    return <FileOutlined />;
};

const FileList: React.FC<FileListProps> = ({ files, onRemove, onRename, onPreview }) => {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [newName, setNewName] = useState<string>('');

    const handleRename = (index: number) => {
        if (newName.trim() !== '') {
            onRename(index, newName);
            setEditingIndex(null);
            setNewName('');
        }
    };

    return (
        <div className="file-list">
            {files.map(({ file, progress, renamed }, index) => (
                <div
                    key={index}
                    style={{
                        padding: '12px',
                        borderBottom: '1px solid #f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Space size="middle" align="center">
                        {getFileIcon(file.name)}
                        <div>
                            {editingIndex === index ? (
                                <Input
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    onBlur={() => handleRename(index)} // Enregistrer le nom à la perte de focus
                                    onPressEnter={() => handleRename(index)} // Enregistrer au press Enter
                                    style={{ fontSize: '12px', width: 200 }}
                                />
                            ) : (
                                <>
                                    <Text strong>{renamed || file.name}</Text>
                                    <br />
                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                        {(file.size / (1024 * 1024)).toFixed(2)} mb
                                    </Text>
                                </>
                            )}
                        </div>
                    </Space>

                    <Space size="large" align="center">
                        {typeof progress === 'number' ? (
                            <Progress
                                percent={progress}
                                size="small"
                                style={{ width: 100, marginRight: 8 }}
                            />
                        ) : progress === 'COMPLETE' ? (
                            <CheckCircleFilled style={{ color: '#52c41a' }} />
                        ) : null}

                        <Tooltip title="Rename">
                            <EditOutlined
                                onClick={() => {
                                    setEditingIndex(index);
                                    setNewName(renamed || file.name); // Préparer le champ de texte avec le nom actuel
                                }}
                                style={{ cursor: 'pointer', color: '#1890ff', marginRight: 8 }}
                            />
                        </Tooltip>

                        <Tooltip title="Preview">
                            <EyeOutlined
                                onClick={() => onPreview(file)}
                                style={{ cursor: 'pointer', color: '#1890ff', marginRight: 8 }}
                            />
                        </Tooltip>

                        <Tooltip title="Download">
                            <a href={URL.createObjectURL(file)} download={file.name}>
                                <DownloadOutlined
                                    style={{ cursor: 'pointer', marginRight: 8 }}
                                />
                            </a>
                        </Tooltip>

                        <DeleteOutlined
                            onClick={() => onRemove(index)}
                            style={{ color: '#ff4d4f', cursor: 'pointer' }}
                        />
                    </Space>
                </div>
            ))}
        </div>
    );
};

export default FileList;
