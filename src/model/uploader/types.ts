import {AxiosProgressEvent} from 'axios'

export type UploadPayload = {
  title: string;
  description: string;
  assetFile: File;
  previewFile?: File;
};

export type FileUploadResponse = {
  cid: string;
  bucketId: number;
}

export interface UploadApi {
  uploadSmallPayload(
    payload: UploadPayload,
    onProgressUpdate?: AxiosProgressHandler
  ): Promise<FileUploadResponse>;
  uploadLargePayload(
    payload: UploadPayload,
    onProgressUpdate?: AxiosProgressHandler
  ): Promise<FileUploadResponse>;
}

export type AxiosProgressHandler = (event: AxiosProgressEvent) => void

export type ProgressUpdateCallback = (progress: number) => void;

export type UploadAuthToken = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
};
