import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#71873F',
    },
    secondary: {
      main: '#A36627',
    },
    success: {
      main: '#688557',
    },
    warning: {
      main: '#E0B87E',
    },
    info: {
      main: '#ABBE99',
    },
    error: {
      main: '#d32f2f',
    },
    background: {
      default: '#F2F0EF',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontFamily: '"Lora", serif',
    },
    h2: {
      fontFamily: '"Lora", serif',
    },
    h3: {
      fontFamily: '"Lora", serif',
    },
    h4: {
      fontFamily: '"Lora", serif',
    },
    h5: {
      fontFamily: '"Lora", serif',
    },
    h6: {
      fontFamily: '"Lora", serif',
    },
  },
});

export default theme;
