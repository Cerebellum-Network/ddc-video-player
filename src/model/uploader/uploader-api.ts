import axios, {AxiosInstance} from 'axios'
import {UPLOAD_BASE_URL} from '../../constants/env'
import {AxiosProgressHandler, FileUploadResponse, UploadApi, UploadPayload} from './types'
import {PayloadSizeError} from './payload-size-error'

const TITLE_KEY = 'title';
const DESCRIPTION_KEY = 'description';
const CONTENT_TYPE_KEY = 'contentType';
const ASSET_FILE_KEY = 'asset';
const PREVIEW_FILE_KEY = 'preview';
export const SMALL_FILE_SIZE_LIMIT = 6_000_000; // 6 Mb

export class UploadApiV3 implements UploadApi {
  constructor(private readonly api: AxiosInstance) {}

  async uploadSmallPayload(
    payload: UploadPayload,
    onProgressUpdate?: AxiosProgressHandler
  ): Promise<FileUploadResponse> {
    const { title, description, assetFile, previewFile } = payload;
    const previewFileSize = previewFile?.size ?? 0;
    if (assetFile.size + previewFileSize > SMALL_FILE_SIZE_LIMIT) {
      throw new PayloadSizeError(
        `Total payload size must be less then ${SMALL_FILE_SIZE_LIMIT} bytes!`
      );
    }

    const formData = new FormData();
    formData.append(TITLE_KEY, title);
    formData.append(DESCRIPTION_KEY, description);
    formData.append(CONTENT_TYPE_KEY, assetFile.type);
    formData.append(ASSET_FILE_KEY, assetFile);
    if (previewFile) {
      formData.append(PREVIEW_FILE_KEY, previewFile);
    }

    const config = {
      onUploadProgress: onProgressUpdate,
    };

    const { data } = await this.api.post(
      `${UPLOAD_BASE_URL}/assets/v3`,
      formData,
      config
    );
    return data;
  }

  async uploadLargePayload(
    payload: UploadPayload,
    onProgressUpdate?: AxiosProgressHandler
  ): Promise<FileUploadResponse> {
    const { title, description, assetFile, previewFile } = payload;
    const previewFileSize = previewFile?.size ?? 0;
    if (assetFile.size + previewFileSize < SMALL_FILE_SIZE_LIMIT) {
      throw new PayloadSizeError(
        `Total payload size must be more then ${SMALL_FILE_SIZE_LIMIT} bytes!`
      );
    }

    const presignedUrls = await this.api
      .get<{
        assetKey: string;
        previewKey: string;
        assetUrl: string;
        previewUrl: string;
      }>(`${UPLOAD_BASE_URL}/assets/v3/presigned-urls`)
      .then((response) => response.data);

    const headers = {
      'Content-Type': 'application/octet-stream',
    };
    const uploadRequests: Array<Promise<void>> = [
      axios.put(presignedUrls.assetUrl, assetFile, {
        headers,
        onUploadProgress: onProgressUpdate,
      }),
    ];
    if (previewFile) {
      uploadRequests.push(
        axios.put(presignedUrls.assetUrl,
          previewFile,
          { headers }
        )
      );
    }

    await Promise.all(uploadRequests);
    const { data } = await this.api.post(
      `${UPLOAD_BASE_URL}/assets/v3/${presignedUrls.assetKey}`,
      {
        title,
        description,
        contentType: assetFile.type,
      }
    );
    return data;
  }
}
