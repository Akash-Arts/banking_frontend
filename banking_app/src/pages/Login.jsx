import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/api";
import emailjs from "@emailjs/browser";
import { VerifyCode } from "./VerifyCode";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState("");

  const sendEmail = (otp, email) => {
    emailjs
      .send(
        "service_z4hhz0n",
        "template_ndiwg6m",
        { otp: otp, user_email: email },
        "wHoxCfPlxyWe8PvfZ"
      )
      .then(
        () => alert("Email sent successfully!"),
        (err) => alert("Email failed: " + err.text)
      );
  };
  const handleLogin = async () => {
    const res = await axios.post("/auth/login", form);
    setEmail(res.data.user?.email);
    sendEmail(res.data.user?.loginOtp, res.data.user?.email);
    setShowOtp(true);
  };

  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f5f5f5"
    >
      <Paper sx={{ p: 4, width: 360 }}>
        <Typography variant="h5" align="center" mb={2}>
          Banking Login
        </Typography>

        <TextField
          fullWidth
          label="Email ID"
          margin="dense"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <TextField
          fullWidth
          label="Password"
          margin="dense"
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleLogin}
          disabled={!form.email || !form.password}
        >
          Login
        </Button>
      </Paper>

      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError("")}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
      {showOtp && (
        <VerifyCode email={email} onClose={() => setShowOtp(false)} />
      )}
    </Box>
  );
}
