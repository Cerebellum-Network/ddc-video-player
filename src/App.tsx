import React, {FormEvent} from 'react'
import {connectionManager} from './model/wallet'
import {MetamaskConnector} from './model/wallet/metamask-connector'
import {NETWORK_ID} from './constants/env'
import {nftMintingService} from './model'

export const App = () => {
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const mintingParams = Object.fromEntries(form.entries());
    await nftMintingService.mint(mintingParams as any)
    console.log('minted!')
  }

  const connectWallet = () => {
    connectionManager.connect(new MetamaskConnector(Number(NETWORK_ID)))
  }

  return (
    <div className="App">
      <button onClick={connectWallet}>Connect wallet</button>
      <form onSubmit={onSubmit}>
        <div className="fields-container">
          <input type="text" name="title" placeholder="title"/>
          <input type="text" name="description" placeholder="description"/>
          <input type="text" name="collectionTitle" placeholder="collectionTitle"/>
          <input type="number" name="qtyToMint" placeholder="qtyToMint"/>
          <input type="file" name="videoFile"/>
          <button type="submit">Upload</button>
        </div>
      </form>
    </div>
  );
}
