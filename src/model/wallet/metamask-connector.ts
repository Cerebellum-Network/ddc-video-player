import { importProvider } from '@cere/freeport-sdk';
import { providers } from 'ethers';
import {WalletConnector} from './types'
import {NetworkNotSupportedError} from './network-not-supported-error'
import {NETWORK_ID} from '../../constants/env'


export class MetamaskConnector implements WalletConnector {
  constructor(private readonly networkId: number) {
    if (!networkId) {
      throw new Error('REACT_APP_NETWORK_ID ENV param should be specified!');
    }
  }

  async connectToWallet(): Promise<providers.Web3Provider> {
    this.clearNotMetamaskProviders();
    const provider = importProvider();
    await this.switchNetwork(provider);
    await provider.send('eth_requestAccounts', []);
    return provider;
  }

  private clearNotMetamaskProviders(): void {
    const windowEthereum: any = window.ethereum;

    if (
      !windowEthereum ||
      (!windowEthereum.isMetaMask && !windowEthereum.providers)
    ) {
      throw new Error('MetaMask is not installed!');
    }

    if (!windowEthereum.providers) {
      return;
    }

    const metamaskProvider = windowEthereum.providers.find(
      (p: any) => p.isMetaMask
    );
    if (!metamaskProvider) {
      throw new Error('MetaMask is not installed!');
    }

    window.ethereum = metamaskProvider;
  }

  private async switchNetwork(provider: providers.Web3Provider): Promise<void> {
    try {
      await provider.send('wallet_switchEthereumChain', [
        { chainId: `0x${this.networkId.toString(16)}` },
      ]);
    } catch {
      throw new NetworkNotSupportedError(Number(NETWORK_ID));
    }
  }
}
