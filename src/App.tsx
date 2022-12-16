import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ReactComponent as AppLogo } from "./assets/app-logo.svg";
import UploadIcon from "@mui/icons-material/Upload";
import { AppBar, Toolbar, Button } from "./components";
import { VideoDetailsPage } from "./pages/VideoDetailsPage";
import { VideosListPage } from "./pages/VideosListPage";
import { VideoUploadPage } from "./pages/VideoUploadPage";
import { Container } from "@mui/material";

export const App = () => {
  return (
    <Router>
      <AppBar>
        <Toolbar>
          <Link className="link" to="/">
            <AppLogo />
          </Link>
          <Link className="link" to="/upload">
            <Button startIcon={<UploadIcon />}>Upload Video</Button>
          </Link>
        </Toolbar>
      </AppBar>
      <Container sx={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
        <Routes>
          <Route index element={<VideosListPage />} />
          <Route path="/video/:bucketId/:cid" element={<VideoDetailsPage />} />
          <Route path="/upload" element={<VideoUploadPage />} />
        </Routes>
      </Container>
    </Router>
  );
};
