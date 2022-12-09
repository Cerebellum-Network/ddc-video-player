export interface IBucketManager {
  createBucket(balance?: bigint, size?: bigint): Promise<bigint>
}
