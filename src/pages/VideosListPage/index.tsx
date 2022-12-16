import { Typography, Grid, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, MouseEvent } from "react";
import { getVideosList, VideoItem } from "../../api";
import { Button } from "../../components";

const BUCKET_ID = BigInt(11);

export const VideosListPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<VideoItem[]>([]);

  useEffect(() => {
    getVideosList(BUCKET_ID).then((itms) => setItems(itms));
  }, []);

  const handleCardClick = (event: MouseEvent<HTMLElement>) => {
    const cid = event.currentTarget.getAttribute("data-cid");
    navigate(`/video/${BUCKET_ID}/${cid}`);
  };

  return (
    <Grid container spacing={2}>
      {items.map((item) => (
        <Grid
          item
          xs={12}
          md={4}
          key={item.videoCid}
          data-cid={item.videoCid}
          onClick={handleCardClick}
        >
          <ImageBox>
            <Image src={item.cover} alt={item.title} loading="lazy" />
            <Description>{item.title}</Description>
          </ImageBox>

          <Button fullWidth>
            Watch Video <ArrowForwardIosIcon style={{ height: "16px" }} />
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

const ImageBox = styled(Box)(() => ({
  position: "relative",
  borderRadius: "14px",
  overflow: "hidden",
  height: "200px",
  marginBottom: "16px",
  border: "2px solid rgba(248, 248, 250, 0.1)",
  filter:
    "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)) drop-shadow(0px 4px 28px rgba(177, 29, 100, 0.25))",
}));

const Image = styled("img")(() => ({
  width: "100%",
  height: "100%",
  objectFit: "cover",
}));

const Description = styled(Typography)(({ theme }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  padding: "12px",
}));
