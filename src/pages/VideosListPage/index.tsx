import {ImageList, ImageListItem, ImageListItemBar, Paper} from '@mui/material'
import {useEffect, useState, MouseEvent} from 'react'
import {getVideosList, VideoItem} from '../../api'
import {useNavigate} from 'react-router-dom'

const BUCKET_ID = BigInt(11);

export const VideosListPage = () => {
  const navigate = useNavigate()
  const [items, setItems] = useState<VideoItem[]>([]);

  useEffect(() => {
    getVideosList(BUCKET_ID).then(itms => setItems(itms))
  }, [])

  const handleCardClick = (event: MouseEvent<HTMLLIElement>) => {
    const cid = event.currentTarget.getAttribute('data-cid');
    navigate(`/video/${BUCKET_ID}/${cid}`)
  }

  return (
    <ImageList sx={{ width: '100%' }} cols={4}>
      {items.map((item) => (
        <Paper key={item.videoCid} elevation={2} sx={{width: 300}}>
          <ImageListItem data-cid={item.videoCid} onClick={handleCardClick}>
            <img
              src={item.cover}
              alt={item.title}
              style={{height: '300px', width: '300px', objectFit: 'cover'}}
              loading="lazy"
            />
            <ImageListItemBar
              title={item.title}
            />
          </ImageListItem>
        </Paper>
      ))}
    </ImageList>
  )
}
