import WalletConnectProvider from '@walletconnect/web3-provider';
import { providers } from 'ethers';
import {WalletConnector} from './types'
import {MaticTestnetIdEnum} from '../../constants/web3'


export class WalletConnectConnector implements WalletConnector {
  async connectToWallet(): Promise<providers.Web3Provider> {
    const wcProvider = new WalletConnectProvider({
      rpc: {
        1: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
        [MaticTestnetIdEnum.MaticTestnetNetworkId]:
          'https://rpc-mumbai.maticvigil.com',
      },
    });
    await wcProvider.enable();
    return new providers.Web3Provider(wcProvider);
  }
}
