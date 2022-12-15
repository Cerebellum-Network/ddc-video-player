import {DdcClient} from '@cere-ddc-sdk/ddc-client'
import {IBucketManager} from './IBucketManager'

export class DDCBucketManager implements IBucketManager {
  constructor(private readonly ddcClient: DdcClient, private readonly storageClusterId: bigint) {
  }

  async createBucket(size: bigint = BigInt(1), balance: bigint = BigInt(10)): Promise<bigint> {
    const {bucketId} = await this.ddcClient.createBucket(balance, size, this.storageClusterId, {replication: 1});
    return bucketId;
  }

}
