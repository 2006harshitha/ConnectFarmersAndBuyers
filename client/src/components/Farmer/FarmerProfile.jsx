import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

const FarmerProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phoneNumber: "",
    address: {
      houseNo: "",
      street: "",
      mandalDistrict: "",
      state: "",
      zipcode: "",
    },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.username) {
      fetchProfile();
    }
  }, [user?.username]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/auth/user/${user.username}`);
      setProfile(res.data);
      setFormData({
        email: res.data.email,
        phoneNumber: res.data.phoneNumber,
        address: res.data.address || {
          houseNo: "",
          street: "",
          mandalDistrict: "",
          state: "",
          zipcode: "",
        },
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      ["houseNo", "street", "mandalDistrict", "state", "zipcode"].includes(name)
    ) {
      setFormData({
        ...formData,
        address: { ...formData.address, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.put(`/api/auth/update/${user.username}`, formData);
      await fetchProfile();
      setEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <Container
        maxWidth="md"
        sx={{ display: "flex", justifyContent: "center", mt: 4 }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (!profile) return <Typography>No profile data found</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Avatar
            sx={{ width: 100, height: 100, mr: 4 }}
            alt={profile.name}
            src="/static/images/avatar/1.jpg"
          />
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {profile.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {profile.role === "farmer"
                ? "Professional Farmer"
                : "Agricultural Buyer"}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Personal Details
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Username
              </Typography>
              <Typography variant="body1">{profile.username}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Gender
              </Typography>
              <Typography variant="body1">
                {profile.gender.charAt(0).toUpperCase() +
                  profile.gender.slice(1)}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Age
              </Typography>
              <Typography variant="body1">{profile.age} years</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Contact Information & Address
            </Typography>
            {editing ? (
              <>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="House No"
                  name="houseNo"
                  value={formData.address.houseNo}
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Street"
                  name="street"
                  value={formData.address.street}
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Mandal/District"
                  name="mandalDistrict"
                  value={formData.address.mandalDistrict}
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={formData.address.state}
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Zipcode"
                  name="zipcode"
                  value={formData.address.zipcode}
                  onChange={handleChange}
                  margin="normal"
                />

                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleUpdate}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<CancelIcon />}
                    onClick={() => setEditing(false)}
                    disabled={loading}
                  >
                    Discard Changes
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{profile.email}</Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1">{profile.phoneNumber}</Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="body1">
                  {`${profile.address?.houseNo || ""}, ${
                    profile.address?.street || ""
                  }, ${profile.address?.mandalDistrict || ""}, ${
                    profile.address?.state || ""
                  } - ${profile.address?.zipcode || ""}`}
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setEditing(true)}
                  sx={{ mt: 2 }}
                >
                  Edit Contact & Address
                </Button>
              </>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default FarmerProfile;
