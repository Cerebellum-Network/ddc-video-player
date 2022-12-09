import {WalletConnector} from './types'
import {MetamaskConnector} from './metamask-connector'
import {NETWORK_ID} from '../../constants/env'
import {WalletConnectConnector} from './wallet-connect-connector'

const LAST_CONNECTOR_KEY = 'last_connector_key';

export class LastConnectorStorage {
  setLastUsedConnector(connector: WalletConnector): void {
    const className = connector.constructor.name;
    window.localStorage.setItem(LAST_CONNECTOR_KEY, className);
  }

  getLastUsedConnector(): WalletConnector | null {
    const lastConnectorClassName =
      window.localStorage.getItem(LAST_CONNECTOR_KEY);
    switch (lastConnectorClassName) {
      case MetamaskConnector.name:
        return new MetamaskConnector(Number(NETWORK_ID));
      case WalletConnectConnector.name:
        return new WalletConnectConnector();
      default:
        return null;
    }
  }
}
