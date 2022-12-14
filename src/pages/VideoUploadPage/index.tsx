import React, {FormEvent, useState} from 'react'
import {Box, TextField, Paper, Button} from '@mui/material'
import {DDCUploader} from '../../model/ddc-uploader/DDCUploader'
import {ddcClient} from '../../model'
// import {DDCBucketManager} from '../../model/bucket/DDCBucketManager'
import {UploadField} from '../../components/UploadField'
import CircularProgress from '@mui/material/CircularProgress'
import {Tag} from '@cere-ddc-sdk/ddc-client'
import {cidsStorage} from '../../model/storage/CidsStorage'
import {useNavigate} from 'react-router-dom'

export const VideoUploadPage = () => {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState<boolean>(false)
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setProcessing(true)
    const uploader = new DDCUploader(ddcClient.get())
    const form = new FormData(e.currentTarget)
    const formValues = Object.fromEntries(form.entries())
    const coverCid = await uploader.upload(formValues.videoCover as File, 11n)
    const uploadResult = await uploader.upload(
      formValues.videoFile as File,
      11n,
      [
        new Tag('title', formValues.title as string),
        new Tag('description', formValues.description as string),
        new Tag('coverCid', coverCid.path as string),
      ]
    )
    cidsStorage.addCid(uploadResult.path as string);
    navigate(`/video/11/${uploadResult.path}`);
  }

  // const createBucket = async () => {
  //   const manager = new DDCBucketManager(ddcClient.get(), 1n)
  //   const bucketId = await manager.createBucket()
  // }

  return (
    <form onSubmit={onSubmit}>
      <Box sx={{display: 'flex', width: '100%', gap: '1rem', justifyContent: 'space-between'}}>
        <Paper elevation={1} sx={{display: 'flex', height: '450px', padding: '1rem', flexGrow: 1}}>
          <UploadField name="videoFile" placeholder="Click to select a video to upload" disabled={processing} accept=".mp4"/>
        </Paper>
        <Paper elevation={1} sx={{
          display: 'flex',
          height: '450px',
          flexDirection: 'column',
          padding: '1rem',
          alignItems: 'center',
          flexGrow: 1
        }}>
          <TextField name="title" label="Title" sx={{marginBottom: '1rem', width: '100%'}} disabled={processing}/>
          <TextField name="description" label="Description" multiline rows={4}
                     sx={{marginBottom: '1rem', width: '100%'}} disabled={processing}/>
          <Box sx={{width: '100%', height: '150px', marginBottom: '1rem'}}>
            <UploadField name="videoCover" placeholder="Click to select a cover image to upload" accept=".jpeg, .png" disabled={processing}/>
          </Box>
          <Button variant="outlined" type="submit" sx={{width: '145px'}} disabled={processing}>
            {processing ?
              <CircularProgress size={25}/>
              : 'Upload video'}
          </Button>
        </Paper>
      </Box>
    </form>
  )
}
