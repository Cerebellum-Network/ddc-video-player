import { providers } from 'ethers';
import {LastConnectorStorage} from './last-connector-storage'
import {WalletConnector} from './types'
import {NETWORK_ID} from '../../constants/env'
import {NetworkNotSupportedError} from './network-not-supported-error'


export class ConnectionManager {
  private provider: providers.Web3Provider | null = null;

  constructor(private readonly lastConnectorStorage: LastConnectorStorage) {}

  async connect(connector: WalletConnector): Promise<string> {
    this.provider = await connector.connectToWallet();
    const connectedNetwork = await this.provider.getNetwork();
    if (connectedNetwork.chainId !== Number(NETWORK_ID)) {
      await this.disconnect();
      throw new NetworkNotSupportedError(Number(NETWORK_ID));
    }

    const address = await this.provider.getSigner().getAddress();
    this.lastConnectorStorage.setLastUsedConnector(connector);
    return address.toLowerCase();
  }

  async disconnect(): Promise<void> {
    this.provider = null;
    window.localStorage.clear();
  }

  async restoreConnection(): Promise<void> {
    const lastUsedConnector = this.lastConnectorStorage.getLastUsedConnector();
    if (!lastUsedConnector) {
      return;
    }

    await this.connect(lastUsedConnector);
  }

  async getSigner(): Promise<providers.JsonRpcSigner | null> {
    if (!this.provider) {
      await this.restoreConnection();
    }

    return this.provider?.getSigner() ?? null;
  }
}
