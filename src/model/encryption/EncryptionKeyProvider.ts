import {importProvider} from '@cere/freeport-sdk';

export class EncryptionKeyProvider {
  static async get(publicKey: string): Promise<string> {
    const provider = importProvider();
    const encryptionKey: unknown = await provider.send(
      'eth_getEncryptionPublicKey',
      [publicKey]
    );
    return encryptionKey as string;
  }
}
