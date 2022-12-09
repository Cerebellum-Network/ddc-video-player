import {BytesLike} from 'ethers'
import {ConnectionManager} from '../wallet/connection-manager'
import {CollectionsManager} from '../collections/CollectionsManager'
import {SmartContractsProvider} from '../contracts/SmartContractsProvider'
import {Uploader} from '../uploader/uploader'
import {FileUploadResponse} from '../uploader/types'

type NftParams = {
  title: string;
  description: string;
  videoFile: File;
  videoFilePreview?: File;
  qtyToMint: number;
  collectionTitle: string;
}

export class NftMinter {
  constructor(
    private readonly contractsProvider: SmartContractsProvider,
    private readonly connectionManager: ConnectionManager,
    private readonly collectionsManager: CollectionsManager,
    private readonly uploader: Uploader,
  ) {
  }

  async mint(params: NftParams): Promise<void> {
    const {title, description, videoFile, videoFilePreview, qtyToMint, collectionTitle} = params;
    const signer = await this.connectionManager.getSigner();
    const userPublicKey = await signer?.getAddress();
    const mintedNftAddress = await this.mintNft(userPublicKey!, collectionTitle, qtyToMint)
    const uploadResponse = await this.uploadVideContent(title, description, videoFile, videoFilePreview);
    await this.attachContentToNft(mintedNftAddress, JSON.stringify(uploadResponse));
  }

  private async mintNft(userPublicKey: string, collectionTitle: string, qtyToMint: number): Promise<string> {
    const collectionAddress = await this.getCollectionAddressOrCreate(userPublicKey!, collectionTitle)
    const collectionsFactory = await this.contractsProvider.getCollectionsFactory();
    const mintTx = await collectionsFactory.mintOnBehalf(
      collectionAddress,
      userPublicKey!,
      qtyToMint,
      [0]
    )
    const mintTxReceipt = await mintTx.wait();
    const onBehalfEvent = mintTxReceipt?.events?.find(
      (event) => event?.event === 'MintOnBehalf'
    );
    if (!onBehalfEvent) {
      throw new Error(
        'Something wrong with transaction. MintOnBehalf not found!'
      );
    }
    const mintedNftAddress: string | undefined = BigInt(
      onBehalfEvent?.args?.[3]?.toString()
    ).toString();

    if (!mintedNftAddress) {
      throw new Error('Something wrong with transaction');
    }
    return mintedNftAddress;
  }

  private async uploadVideContent(title: string, description: string, videoFile: File, videoFilePreview?: File): Promise<FileUploadResponse> {
    return await this.uploader.upload({
      title,
      description,
      assetFile: videoFile,
      previewFile: videoFilePreview
    });
  }

  private async attachContentToNft(nftAddress: string, jsonContentString: string): Promise<void> {
    const attachmentManager = await this.contractsProvider.getNftAttachmentManager();
    const attachmentTx = await attachmentManager.collectionManagerAttachToNFT(
      nftAddress,
      this.stringToDataHexString(jsonContentString)
    )
    await attachmentTx.wait()
  }

  private async getCollectionAddressOrCreate(userPublicKey: string, collectionTitle: string): Promise<string> {
    const userCollections = await this.collectionsManager.getUserCollections(userPublicKey);
    const collection = userCollections.find(c => c.name === collectionTitle);
    if (collection) {
      return collection.address;
    }
    const createdCollectionAddress = await this.collectionsManager.createCollection(userPublicKey!, collectionTitle)
    return createdCollectionAddress!;
  }

  private stringToDataHexString(text: string): BytesLike {
    return `0x${[...text].map((char) => char.charCodeAt(0).toString(16)).join('')}`;
  }
}
