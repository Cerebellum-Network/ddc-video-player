import React from 'react'
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import {VideoDetailsPage} from './pages/VideoDetailsPage'
import {VideosListPage} from './pages/VideosListPage'
import {VideoUploadPage} from './pages/VideoUploadPage'
import {AppBar, Container, Toolbar, Typography} from '@mui/material'
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';


export const App = () => {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{flexGrow: 1}}>
            <Link className="link" to="/">
              <VideoLibraryIcon sx={{marginRight: '.5rem'}}/>
              Streaming app
            </Link>
          </Typography>
          <Typography variant="h6">
            <Link className="link" to="/upload">
              Upload Video
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{marginTop: '2rem'}}>
        <Routes>
          <Route index element={<VideosListPage/>}/>
          <Route path="/video/:bucketId/:cid" element={<VideoDetailsPage/>}/>
          <Route path="/upload" element={<VideoUploadPage/>}/>
        </Routes>
      </Container>
    </Router>
  )
}
