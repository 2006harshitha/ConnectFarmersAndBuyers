import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useAuth } from "../../context/authContext";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Farmer Marketplace
        </Typography>
        {user && (
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
