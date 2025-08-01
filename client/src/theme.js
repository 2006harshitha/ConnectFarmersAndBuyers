import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#81c784", // Light green
    },
    secondary: {
      main: "#66bb6a", // Slightly darker green
    },
    background: {
      default: "#f5f5f5", // Light gray background
      paper: "#ffffff", // White cards
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default theme;
