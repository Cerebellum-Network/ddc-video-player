import {Button as ButtonMui} from '@mui/material'
import { styled } from "@mui/material/styles";

export const Button = styled(ButtonMui)(({ theme }) => ({
    background: `linear-gradient(277.13deg, #B01C63 11.98%, #FA0C58 83.77%)`,
    color: theme.palette.common.white,
    height: '44px',
    borderRadius: '22px',
    textTransform: 'none',
    paddingLeft: '16px',
    paddingRight: '16px'
}))    

