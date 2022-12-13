import {Piece} from '@cere-ddc-sdk/ddc-client'

export const getTagsFromPiece = (piece: Piece) => piece.tags.map(t => ({
  key: String.fromCharCode(...t.key),
  value: String.fromCharCode(...t.value)
})).reduce((acc, t) => {
  acc[t.key] = t.value
  return acc;
}, {} as any)
