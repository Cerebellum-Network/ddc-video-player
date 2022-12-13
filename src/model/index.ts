import {NftMinter} from './nft/NftMinter'
import {SmartContractsProvider} from './contracts/SmartContractsProvider'
import {CollectionsManager} from './collections/CollectionsManager'
import {createFileUploadApi} from './uploader/auth-api'
import {Uploader} from './uploader/uploader'
import {UploadApiV3} from './uploader/uploader-api'
import {connectionManager} from './wallet'
import {AppDdcClient} from './ddc-client'

const contractsProvider = new SmartContractsProvider(connectionManager);
const collectionsManager = new CollectionsManager(contractsProvider);
const api = createFileUploadApi();
const uploader = new Uploader(new UploadApiV3(api));

export const nftMintingService = new NftMinter(contractsProvider, connectionManager, collectionsManager, uploader);

export const ddcClient = new AppDdcClient();
