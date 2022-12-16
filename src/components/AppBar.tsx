import { AppBar as AppBarMui } from "@mui/material";
import { styled } from "@mui/material/styles";

export const AppBar = styled(AppBarMui)(({ theme }) => ({
  position: "static",
  backgroundColor: theme.palette.common.white,
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none'
}));
