import axios from 'axios';
import {SmartContractsProvider} from '../contracts/SmartContractsProvider'
import {FREEPORT_API_URL} from '../../constants/env'
import {CollectionFieldProps} from '../../types'

export class CollectionsManager {
  constructor(private readonly contractProvider: SmartContractsProvider) {
  }

  async createCollection(userPubKey: string, collectionName: string): Promise<string | null> {
    const collectionFactory = await this.contractProvider.getCollectionsFactory()
    const tx = await collectionFactory.createCollection(
      userPubKey,
      collectionName,
      `${FREEPORT_API_URL}/nft/`,
      ''
    );
    const receipt = await tx.wait();
    const address: string | undefined =
      receipt?.events?.[6].args?.[1]?.toString();
    return address ?? null;
  }

  async getUserCollections(userPubKey: string): Promise<CollectionFieldProps[]> {
    const {data} = await axios.get(`${FREEPORT_API_URL}/wallet/${userPubKey}/collections`);
    return data;
  }
}
