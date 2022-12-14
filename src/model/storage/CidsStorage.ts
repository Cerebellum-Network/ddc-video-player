const CIDS_KEY = 'user-cids';

export class CidsStorage {
  getCids() {
    return localStorage.getItem(CIDS_KEY)?.split(',') ?? [];
  }

  addCid(cid: string) {
    const cids = this.getCids();
    cids.push(cid);
    localStorage.setItem(CIDS_KEY, cids.join(','));
  }
}

export const cidsStorage = new CidsStorage();
