import { providers } from 'ethers';

export interface WalletConnector {
  connectToWallet(): Promise<providers.Web3Provider>;
}
