import {DdcClient, DEVNET} from '@cere-ddc-sdk/ddc-client'

export class AppDdcClient {
  client: DdcClient | null = null

  async init() {
    this.client = await DdcClient.buildAndConnect({
      clusterAddress: 0,
      smartContract: DEVNET,
      fileOptions: {pieceSizeInBytes: 512 * 1024, parallel: 4}
    }, 'quote parrot code announce cart brother brother prefer gravity moon clay broom')
    if (!this.client) {
      throw new Error('Error creating DDC client')
    }
    // await this.client.accountDeposit(1n);
    // await this.client.smartContract.accountBond(1n);
  }

  get(): DdcClient {
    if (!this.client) {
      throw new Error('DDC client is not initialized')
    }
    return this.client
  }
}

