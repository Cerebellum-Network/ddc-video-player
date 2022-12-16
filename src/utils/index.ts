import {Piece} from '@cere-ddc-sdk/ddc-client'

export const getTagsFromPiece = (piece: Piece) => piece.tags.map(t => ({
  // @ts-ignore
  key: String.fromCharCode(...t.key),
  // @ts-ignore
  value: String.fromCharCode(...t.value)
})).reduce((acc, t) => {
  acc[t.key] = t.value
  return acc;
}, {} as any)
