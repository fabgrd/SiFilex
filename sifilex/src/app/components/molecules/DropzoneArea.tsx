import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Upload, message } from 'antd';
import type { UploadProps } from 'antd';

export interface DropzoneAreaProps {
  options?: {
    maxFiles?: number;
    maxSize?: number;
    accept?: string[];
  };
  disabled?: boolean;
  onDrop: (files: File[]) => void;
}

export const DropzoneArea: React.FC<DropzoneAreaProps> = ({ options, disabled = false, onDrop }) => {
  const { maxFiles, maxSize, accept } = options || {};

  const formatMaxSize = (size: number) => {
    return `${(size / 1024 / 1024).toFixed(1)}MB`;
  };

  const validateFileType = (file: File): boolean => {
    if (!accept || accept.length === 0) return true;
    
    const fileType = file.type;
    const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    
    return accept.some(type => {
      if (type.startsWith('.')) return extension === type.toLowerCase();
      if (type.includes('*')) return fileType.startsWith(type.split('*')[0]);
      return fileType === type;
    });
  };

  const props: UploadProps = {
    name: 'file',
    multiple: maxFiles ? maxFiles > 1 : true,
    showUploadList: false,
    accept: accept?.join(','),
    beforeUpload: (file) => {
      // Vérification du type de fichier
      if (!validateFileType(file)) {
        message.error(
          `Le fichier "${file.name}" n'est pas supporté. Types acceptés : ${accept?.join(', ')}`
        );
        return false;
      }

      // Vérification de la taille
      if (maxSize && file.size > maxSize) {
        message.error(
          `Le fichier "${file.name}" est trop volumineux (${formatMaxSize(file.size)}). ` +
          `Taille maximale autorisée : ${formatMaxSize(maxSize)}`
        );
        return false;
      }

      onDrop([file]);
      return false;
    },
    onDrop(e) {
      const droppedFiles = Array.from(e.dataTransfer.files);

      // Vérification du nombre de fichiers
      if (maxFiles && droppedFiles.length > maxFiles) {
        message.error(
          `Vous ne pouvez télécharger que ${maxFiles} fichier${maxFiles > 1 ? 's' : ''} à la fois`
        );
        return;
      }

      // Vérification des types de fichiers
      const invalidTypeFiles = droppedFiles.filter(file => !validateFileType(file));
      if (invalidTypeFiles.length > 0) {
        message.error(
          `${invalidTypeFiles.length} fichier${invalidTypeFiles.length > 1 ? 's' : ''} non supporté${invalidTypeFiles.length > 1 ? 's' : ''}. ` +
          `Types acceptés : ${accept?.join(', ')}`
        );
        return;
      }

      // Vérification de la taille
      const validFiles = maxSize
        ? droppedFiles.filter(file => file.size <= maxSize)
        : droppedFiles;

        const oversizedFiles = droppedFiles.length - validFiles.length;
        if (oversizedFiles > 0) {
          message.error(
            `${oversizedFiles} fichier${oversizedFiles > 1 ? 's' : ''} dépass${oversizedFiles > 1 ? 'ent' : 'e'} ` +
            `la taille maximale de ${maxSize ? formatMaxSize(maxSize) : 'non définie'}`
          );
        }

      if (validFiles.length > 0) {
        onDrop(validFiles);
      }
    },
    disabled,
  };

  return (
    <Upload.Dragger {...props} className={disabled ? 'opacity-50 cursor-not-allowed' : ''}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Cliquez ou glissez-déposez vos fichiers ici
      </p>
      <p className="ant-upload-hint">
        {maxFiles && `Limite : ${maxFiles} fichier${maxFiles > 1 ? 's' : ''}`}
        {maxSize && ` • Taille max : ${formatMaxSize(maxSize)}`}
        {(accept ?? []).length > 0 && ` • Types acceptés : ${accept?.join(', ') || 'Tous les types'}`}
      </p>
    </Upload.Dragger>
  );
};