export interface FileTypeConfig {
    extension: string;
    mimeType: string;
    description: string;
    icon?: string;
    previewSupported: boolean;
}

export const FILE_TYPES: Record<string, FileTypeConfig> = {
    PDF: {
        extension: '.pdf',
        mimeType: 'application/pdf',
        description: 'Document PDF',
        previewSupported: true
    },
    TXT: {
        extension: '.txt',
        mimeType: 'text/plain',
        description: 'Fichier texte',
        previewSupported: true
    },
    MD: {
        extension: '.md',
        mimeType: '.md',
        description: 'Fichier Markdown',
        previewSupported: true
    },
    DOC: {
        extension: '.doc',
        mimeType: 'application/msword',
        description: 'Document Word',
        previewSupported: false
    },
    DOCX: {
        extension: '.docx',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        description: 'Document Word',
        previewSupported: false
    },
    IMAGE: {
        extension: '.*', 
        mimeType: 'image/*',
        description: 'Image',
        previewSupported: true
    }
};

export const GLOBAL_MAX_FILE_SIZE = 20 * 1024 * 1024; 
export const MAX_FILES = 20;

export const getAcceptedFileTypes = () => {
    return Object.values(FILE_TYPES).map(type => type.mimeType);
};

export const getAcceptedExtensions = () => {
    return Object.values(FILE_TYPES).map(type => type.extension);
};

export const isFileTypeSupported = (fileName: string, mimeType: string) => {
    return Object.values(FILE_TYPES).some(type => 
        fileName.toLowerCase().endsWith(type.extension) || 
        mimeType.startsWith(type.mimeType.replace('/*', '')) // Vérifie les images génériques
    );
};

export const getFileTypeConfig = (fileName: string, mimeType: string): FileTypeConfig | undefined => {
    return Object.values(FILE_TYPES).find(type => 
        fileName.toLowerCase().endsWith(type.extension) || 
        mimeType.startsWith(type.mimeType.replace('/*', ''))
    );
};

export const isPreviewSupported = (fileName: string, mimeType: string): boolean => {
    const config = getFileTypeConfig(fileName, mimeType);
    return config?.previewSupported ?? false;
};
