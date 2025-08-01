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
  Link,
} from "@mui/material";
import { useAuth } from "../../context/authContext";
import { Link as RouterLink } from "react-router-dom";

const Login = () => {
  const { login, error, setError } = useAuth();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username or email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        const token = await login(values);
        const decoded = jwtDecode(token);

        // ✅ Redirect based on role
        if (decoded.user.role === "farmer") {
          window.location.href = "/farmer";
        } else if (decoded.user.role === "buyer") {
          window.location.href = "/buyer";
        } else {
          window.location.href = "/dashboard";
        }
      } catch (err) {
        setError("Invalid username or password");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
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
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Link component={RouterLink} to="/forgot-password">
              Forgot Password?
            </Link>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              Don't have an account?{" "}
              <Link component={RouterLink} to="/register">
                Register here
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Login;
