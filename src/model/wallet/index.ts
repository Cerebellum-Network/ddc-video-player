import {LastConnectorStorage} from './last-connector-storage'
import {ConnectionManager} from './connection-manager'

export const lastUsedConnectorStorage = new LastConnectorStorage();
export const connectionManager = new ConnectionManager(
  lastUsedConnectorStorage
);
