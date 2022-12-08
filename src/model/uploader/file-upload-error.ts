export class FileUploadError extends Error {
  constructor(reason?: string) {
    super();
    this.message = `Error while files uploading! Reason: ${reason}`;
    this.name = 'FileUploadError';
  }
}
