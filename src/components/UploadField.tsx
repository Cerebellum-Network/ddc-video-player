import React from 'react'
import {Box, Typography} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

export type UploadFiledProps = {
  name: string;
  placeholder?: string;
  disabled?: boolean;
  accept?: string;
}

export const UploadField = ({name, placeholder, disabled, accept}: UploadFiledProps) => {
  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      position: 'relative',
      background: '#f8f8fa',
      borderRadius: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <input type="file"
             name={name}
             style={{opacity: 0, width: '100%', height: '100%', position: 'absolute'}}
             accept={accept}
             disabled={disabled}/>
      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <CloudUploadIcon sx={{width: '40px', height: '40px'}}/>
        <Typography>{placeholder}</Typography>
      </Box>
    </Box>
  )
}
