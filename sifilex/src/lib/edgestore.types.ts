export interface UploadedFile {
    url: string;
    thumbnailUrl?: string;
    size: number;
    uploadedAt: Date;
    name: string;
    path: string[];
    metadata: {
      userId: string;
      originalName: string;
      fileType: string;
    };
  }
  
  export interface EdgeStoreContext {
    userId: string;
    userEmail: string;
  }