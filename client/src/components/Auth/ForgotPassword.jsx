import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Link,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Box,
  Alert,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const securityQuestions = [
  "What was your first pet's name?",
  "What city were you born in?",
  "What is your mother's maiden name?",
  "What was the name of your first school?",
  "What was your childhood nickname?",
];

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username or Email is required"),
  securityQuestion: Yup.string().required("Security question is required"),
  securityAnswer: Yup.string().required("Security answer is required"),
});

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const formik = useFormik({
    initialValues: {
      username: "",
      securityQuestion: "",
      securityAnswer: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const response = await forgotPassword(values); // API call
        console.log("Forgot Password Response:", response);

        if (response.success && response.resetToken) {
          setSuccess("Identity verified! Redirecting to password reset...");
          setTimeout(() => {
            navigate(
              `/reset-password/${encodeURIComponent(response.username)}/${
                response.resetToken
              }`
            );
          }, 1500);
        } else {
          setError(response.message || "Verification failed");
        }
      } catch (err) {
        console.error("Forgot Password Error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Verification failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Forgot Password
        </Typography>
        <Typography color="textSecondary">
          Please verify your identity to reset your password
        </Typography>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Username or Email"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
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
                label="Security Question"
              >
                {securityQuestions.map((question, index) => (
                  <MenuItem key={index} value={question}>
                    {question}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.securityQuestion &&
                formik.errors.securityQuestion && (
                  <Typography color="error" variant="caption">
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Verify Identity"}
            </Button>
          </Grid>

          <Grid item xs={12} textAlign="center">
            <Link component={RouterLink} to="/login" variant="body2">
              Back to Login
            </Link>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default ForgotPassword;
