export interface IFileDownloader {
  download(cid: string, bucketId: bigint, encryptionKey?: string): Promise<File>
}
