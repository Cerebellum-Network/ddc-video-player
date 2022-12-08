import { SMALL_FILE_SIZE_LIMIT } from './uploader-api';
import {AxiosProgressHandler, FileUploadResponse, ProgressUpdateCallback, UploadApi, UploadPayload} from './types'
import {PayloadSizeError} from './payload-size-error'
import {FileUploadError} from './file-upload-error'
import {AxiosProgressEvent} from 'axios'

export class Uploader {
  constructor(private readonly uploadApi: UploadApi) {}

  async upload(
    payload: UploadPayload,
    onProgressUpdate?: ProgressUpdateCallback
  ): Promise<FileUploadResponse> {
    const { assetFile, previewFile } = payload;
    const previewFileSize = previewFile?.size ?? 0;
    if (assetFile.size + previewFileSize < SMALL_FILE_SIZE_LIMIT) {
      try {
        return await this.uploadApi.uploadSmallPayload(
          payload,
          onProgressUpdate
            ? this.createOnProgressUpdate(onProgressUpdate)
            : undefined
        );
      } catch (error) {
        if (error instanceof PayloadSizeError) {
          throw new FileUploadError('Wrong method used!');
        }

        throw new FileUploadError('Server error');
      }
    }

    try {
      return await this.uploadApi.uploadLargePayload(
        payload,
        onProgressUpdate
          ? this.createOnProgressUpdate(onProgressUpdate)
          : undefined
      );
    } catch (error) {
      if (error instanceof PayloadSizeError) {
        throw new FileUploadError('Wrong method used!');
      }

      throw new FileUploadError('Server error');
    }
  }

  private createOnProgressUpdate(callback: ProgressUpdateCallback): AxiosProgressHandler {
    return (progressEvent: AxiosProgressEvent) => {
      callback(Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1)));
    };
  }
}
