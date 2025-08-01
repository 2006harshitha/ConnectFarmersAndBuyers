import React from "react";
import { useAuth } from "../context/authContext";
import { Typography, Grid, Paper, Box } from "@mui/material";

const Dashboard = () => {
  const { user } = useAuth(); // Get logged-in user data

  // Farmer-specific content
  const FarmerDashboard = () => (
    <div>
      <Typography variant="h4" gutterBottom>
        Farmer Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Your Products</Typography>
            {/* Add product listing component here */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Recent Orders</Typography>
            {/* Add orders component here */}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );

  // Buyer-specific content
  const BuyerDashboard = () => (
    <div>
      <Typography variant="h4" gutterBottom>
        Buyer Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Available Products</Typography>
            {/* Add marketplace browsing component here */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Your Purchases</Typography>
            {/* Add purchase history component here */}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );

  return (
    <Box sx={{ p: 3 }}>
      {user ? (
        user.role === "farmer" ? (
          <FarmerDashboard />
        ) : (
          <BuyerDashboard />
        )
      ) : (
        <Typography>Loading dashboard...</Typography>
      )}
    </Box>
  );
};

export default Dashboard;
