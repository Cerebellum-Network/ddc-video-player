import {DdcClient, File as DdcFile, Tag} from '@cere-ddc-sdk/ddc-client'

export class DDCUploader {
  constructor(private readonly ddcClient: DdcClient) {
  }

  async upload(file: File, bucketId: bigint, tags?: Tag[]) {
    const ddcFile = new DdcFile(file.stream(), tags)
    const result = await this.ddcClient.store(bucketId, ddcFile)
    return result;
  }
}
