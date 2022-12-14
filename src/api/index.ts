import {ddcClient} from '../model'
import {getTagsFromPiece} from '../utils'
import {DdcUri, IPIECE, Piece} from '@cere-ddc-sdk/ddc-client'
import {cidsStorage} from '../model/storage/CidsStorage'

export type VideoItem = {
  videoCid: string,
  title: string;
  cover: string;
}

const videosCids = [
  'bafk2bzaceaipusqkyvowlzdnohzv2foiy2w4ltuey64glqmgskj6ummnflrl4',
  'bafk2bzacedvxckuxfvdv2mtq4qppzkruamebc4za4yypojkksizodgfhaja4i'
]

export const getVideosList = async (bucketId: bigint): Promise<VideoItem[]> => {
  const client = ddcClient.get();
  const result: VideoItem[] = [];
  const cids = [...videosCids, ...cidsStorage.getCids()]
  for (const cid of cids) {
    const fileDescriptor = await client.caStorage.read(bucketId, cid)
    const tags = getTagsFromPiece(fileDescriptor)
    const title = tags.title;
    const coverFile = await client.read(new DdcUri(bucketId, tags.coverCid, IPIECE));
    if (Piece.isPiece(coverFile)) {
      const fileSize = coverFile.links.reduce((size, l) => size + Number(l.size), 0);
      const fileData = new Uint8Array(fileSize)
      let bytesAdded = 0;
      for (const link of coverFile.links) {
        const chunkData = await client.caStorage.read(bucketId, link.cid);
        fileData.set(chunkData.data, bytesAdded);
        bytesAdded = bytesAdded + Number(link.size);
      }
      const blob = new Blob([fileData]);
        result.push({
          videoCid: cid,
          title: title,
          cover: URL.createObjectURL(blob)
        })
    }
  }
  return result
}
