import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{ py: 3, bgcolor: "primary.main", color: "white" }}
    >
      <Typography variant="body2" align="center">
        © {new Date().getFullYear()} Farmer Marketplace
      </Typography>
    </Box>
  );
};

export default Footer;
