import {
  ApplicationEnum,
  CollectionFactory,
  createCollectionFactory, createNFTAttachment,
  Deployment,
  getCollectionFactoryAddress, getNFTAttachmentAddress
} from '@cere/freeport-sdk'
import {ConnectionManager} from '../wallet/connection-manager'
import {APPLICATION, CONTRACTS_DEPLOYMENT} from '../../constants/env'
import {NFTAttachment} from '@cere/freeport-sdk/dist/abi-types/NFTAttachment'

export class SmartContractsProvider {
  constructor(private readonly connectionManager: ConnectionManager) {
  }

  async getCollectionsFactory(): Promise<CollectionFactory> {
    const signer = await this.connectionManager.getSigner();
    const contractAddress = await getCollectionFactoryAddress(
      signer!.provider,
      CONTRACTS_DEPLOYMENT as Deployment,
      APPLICATION as ApplicationEnum
    );

    return createCollectionFactory({ signer: signer!, contractAddress });
  }

  async getNftAttachmentManager(): Promise<NFTAttachment> {
    const signer = await this.connectionManager.getSigner();
    const contractAddress = await getNFTAttachmentAddress(
      signer!.provider,
      CONTRACTS_DEPLOYMENT as Deployment,
      APPLICATION as ApplicationEnum
    );

    return createNFTAttachment({ signer: signer!, contractAddress });
  }
}
