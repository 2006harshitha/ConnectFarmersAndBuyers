import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Box,
  Alert,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import axios from "axios";

const validationSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required("New password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least 6 characters, one uppercase, one lowercase, one number and one special character"
    ),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
});

const ResetPassword = () => {
  const { username, token } = useParams();
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        if (!username || !token) throw new Error("Reset token is missing");

        const decodedUsername = decodeURIComponent(username);
        const response = await axios.get(
          `http://localhost:5000/api/auth/verify-reset-user/${decodedUsername}/${token}`
        );

        if (!response.data.valid)
          throw new Error("Invalid or expired reset link");

        setUserData(response.data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setVerifying(false);
      }
    };

    verifyUser();
  }, [username, token]);

  const handleSubmit = async (values) => {
    setLoading(true);
    setError(null);

    try {
      const response = await resetPassword(userData.username, token, {
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });

      if (response.success) {
        setSuccess("Password reset successfully! Redirecting...");
        setTimeout(() => {
          navigate(
            userData.role === "farmer" ? "/farmer-dashboard" : "/buyer-home"
          );
        }, 1500);
      } else {
        throw new Error(response.message || "Password reset failed");
      }
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: { newPassword: "", confirmPassword: "" },
    validationSchema,
    onSubmit: handleSubmit,
  });

  if (verifying) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Verifying your reset link...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Reset Password {userData?.username && `for ${userData.username}`}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Button
            color="inherit"
            size="small"
            onClick={() => navigate("/forgot-password")}
            sx={{ ml: 2 }}
          >
            Get New Link
          </Button>
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {!error && (
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type="password"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                error={
                  formik.touched.newPassword &&
                  Boolean(formik.errors.newPassword)
                }
                helperText={
                  formik.touched.newPassword && formik.errors.newPassword
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                error={
                  formik.touched.confirmPassword &&
                  Boolean(formik.errors.confirmPassword)
                }
                helperText={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Reset Password"}
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Container>
  );
};

export default ResetPassword;
