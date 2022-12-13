import {useParams} from 'react-router-dom'
import {Box, Paper, Typography} from '@mui/material'
import {useCallback, useEffect, useState} from 'react'
import {ddcClient} from '../../model'
import {getTagsFromPiece} from '../../utils'

export const VideoDetailsPage = () => {
  const {bucketId, cid} = useParams()
  const [fileName, setFileName] = useState<string>('')
  const [fileDescription, setFileDescription] = useState<string>('')

  const readFileMetadata = useCallback(async () => {
    const client = ddcClient.get()
    const fileDescriptor = await client.caStorage.read(BigInt(bucketId!), cid!)
    const tags = getTagsFromPiece(fileDescriptor)
    setFileName(tags.title)
    setFileDescription(tags.description)
  }, [bucketId, cid])

  useEffect(() => {
    void readFileMetadata()
  }, [readFileMetadata])

  return (
    <Box>
      <Paper elevation={2} sx={{height: '600px'}}>
        <video src={`http://localhost:8080/${bucketId}/${cid}`} controls/>
      </Paper>
      <Paper elevation={1} sx={{marginTop: '1rem', padding: '1rem'}}>
        <Typography variant="h5" sx={{fontWeight: 600, marginBottom: '.5rem'}}>{fileName}</Typography>
        <Typography sx={{fontWeight: 600}}>Description</Typography>
        <Typography>{fileDescription}</Typography>
      </Paper>
    </Box>
  )
}
