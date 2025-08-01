import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { jwtDecode } from "jwt-decode";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
  Paper,
  Box,
  Avatar,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuth } from "../../context/authContext";
import { Link as RouterLink } from "react-router-dom";

const Register = () => {
  const { register, error, setError } = useAuth();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      gender: "",
      age: "",
      username: "",
      email: "",
      password: "",
      phoneNumber: "",
      securityQuestion: "What was your first pet's name?",
      securityAnswer: "",
      role: "",
      // Address fields
      houseNo: "",
      street: "",
      mandalDistrict: "",
      state: "",
      zipcode: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      gender: Yup.string().required("Gender is required"),
      age: Yup.number()
        .min(18, "Must be at least 18 years old")
        .required("Age is required"),
      username: Yup.string()
        .min(3, "Username must be at least 3 characters")
        .required("Username is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
          "Password must contain at least one uppercase, one lowercase, one number and one special character"
        )
        .required("Password is required"),
      phoneNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
        .required("Phone number is required"),
      securityQuestion: Yup.string().required("Security question is required"),
      securityAnswer: Yup.string().required("Security answer is required"),
      role: Yup.string().required("Please select your role"),
      // Address validation
      houseNo: Yup.string().required("House No. is required"),
      street: Yup.string().required("Street name is required"),
      mandalDistrict: Yup.string().required("Mandal/District is required"),
      state: Yup.string().required("State is required"),
      zipcode: Yup.string()
        .matches(/^[0-9]{6}$/, "Zipcode must be 6 digits")
        .required("Zipcode is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        const token = await register(values);
        const decoded = jwtDecode(token);

        if (decoded?.user?.role === "farmer") {
          window.location.href = "/farmer";
        } else if (decoded?.user?.role === "buyer") {
          window.location.href = "/buyer";
        } else {
          window.location.href = "/dashboard";
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
  });

  const securityQuestions = [
    "What was your first pet's name?",
    "What city were you born in?",
    "What is your mother's maiden name?",
    "What was the name of your first school?",
    "What was your childhood nickname?",
  ];

  return (
    <Container component="main" maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 2,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Create Account
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{ mt: 1, width: "100%" }}
        >
          <Grid container spacing={2}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  error={formik.touched.gender && Boolean(formik.errors.gender)}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
                {formik.touched.gender && formik.errors.gender && (
                  <Typography variant="caption" color="error">
                    {formik.errors.gender}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age"
                name="age"
                type="number"
                value={formik.values.age}
                onChange={formik.handleChange}
                error={formik.touched.age && Boolean(formik.errors.age)}
                helperText={formik.touched.age && formik.errors.age}
              />
            </Grid>

            {/* Address Section 
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ color: "text.secondary", mt: 1 }}
              >
                Address Information
              </Typography>
            </Grid>*/}

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="House No."
                name="houseNo"
                value={formik.values.houseNo}
                onChange={formik.handleChange}
                error={formik.touched.houseNo && Boolean(formik.errors.houseNo)}
                helperText={formik.touched.houseNo && formik.errors.houseNo}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Street Name / Nearby Place"
                name="street"
                value={formik.values.street}
                onChange={formik.handleChange}
                error={formik.touched.street && Boolean(formik.errors.street)}
                helperText={formik.touched.street && formik.errors.street}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mandal / District"
                name="mandalDistrict"
                value={formik.values.mandalDistrict}
                onChange={formik.handleChange}
                error={
                  formik.touched.mandalDistrict &&
                  Boolean(formik.errors.mandalDistrict)
                }
                helperText={
                  formik.touched.mandalDistrict && formik.errors.mandalDistrict
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={formik.values.state}
                onChange={formik.handleChange}
                error={formik.touched.state && Boolean(formik.errors.state)}
                helperText={formik.touched.state && formik.errors.state}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Zipcode"
                name="zipcode"
                value={formik.values.zipcode}
                onChange={formik.handleChange}
                error={formik.touched.zipcode && Boolean(formik.errors.zipcode)}
                helperText={formik.touched.zipcode && formik.errors.zipcode}
              />
            </Grid>

            {/* Account Information 
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ color: "text.secondary", mt: 1 }}
              >
                Account Information
              </Typography>
            </Grid>*/}

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
                helperText={formik.touched.username && formik.errors.username}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                error={
                  formik.touched.phoneNumber &&
                  Boolean(formik.errors.phoneNumber)
                }
                helperText={
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                }
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Security Question</InputLabel>
                <Select
                  name="securityQuestion"
                  value={formik.values.securityQuestion}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.securityQuestion &&
                    Boolean(formik.errors.securityQuestion)
                  }
                >
                  {securityQuestions.map((question, index) => (
                    <MenuItem key={index} value={question}>
                      {question}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.securityQuestion &&
                  formik.errors.securityQuestion && (
                    <Typography variant="caption" color="error">
                      {formik.errors.securityQuestion}
                    </Typography>
                  )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Security Answer"
                name="securityAnswer"
                value={formik.values.securityAnswer}
                onChange={formik.handleChange}
                error={
                  formik.touched.securityAnswer &&
                  Boolean(formik.errors.securityAnswer)
                }
                helperText={
                  formik.touched.securityAnswer && formik.errors.securityAnswer
                }
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>I am a</InputLabel>
                <Select
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  error={formik.touched.role && Boolean(formik.errors.role)}
                >
                  <MenuItem value="farmer">Farmer</MenuItem>
                  <MenuItem value="buyer">Buyer</MenuItem>
                </Select>
                {formik.touched.role && formik.errors.role && (
                  <Typography variant="caption" color="error">
                    {formik.errors.role}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ py: 1.5 }}
              >
                {loading ? "Creating Account..." : "Register"}
              </Button>
            </Grid>

            <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2">
                Already have an account?{" "}
                <Link component={RouterLink} to="/login" underline="hover">
                  Sign in
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
