export const TOKEN_ID = '0x00';
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export enum MaticTestnetIdEnum {
  MaticTestnetNetworkId = 80_001,
  MaticMainnetNetworkId = 137,
}

export const maticNetworkNames = {
  [MaticTestnetIdEnum.MaticTestnetNetworkId]: 'Mumbai Testnet',
  [MaticTestnetIdEnum.MaticMainnetNetworkId]: 'Matic Mainnet',
};
