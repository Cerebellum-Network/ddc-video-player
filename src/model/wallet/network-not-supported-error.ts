import {maticNetworkNames, MaticTestnetIdEnum} from '../../constants/web3'

export class NetworkNotSupportedError extends Error {
  constructor(networkId: number) {
    super();
    this.message = `Your wallet is not configured to work within ${
      maticNetworkNames[networkId as MaticTestnetIdEnum]
    }.`;
    this.name = 'NetworkNotSupportedError';
  }
}
