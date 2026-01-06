import {
  Box,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DepositDialog from "../components/DepositDialog.jsx";
import WithdrawDialog from "../components/WithdrawDialog.jsx";
import emailjs from "@emailjs/browser";
import axios from "../api/api.js";

export default function UserDashboard() {
  const [balance, setBalance] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [openDeposit, setOpenDeposit] = useState(false);
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const sendEmail = (msg, mailId) => {
    emailjs
      .send(
        "service_z4hhz0n",
        "template_zxczmd9",
        { message: msg, user_email: mailId },
        "wHoxCfPlxyWe8PvfZ"
      )
      .then(
        () => alert("Email sent successfully!"),
        (err) => alert("Email failed: " + err.text)
      );
  };

  const fetchUser = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      console.log(userId);

      const res = await axios.get(`/bank/user/${userId}`);
      console.log("tetsttiing");
      console.log("User fetched:", res.data.user);

      setUser(res?.data?.user);
      setBalance(res?.data?.user.balance);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to fetch user",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear(); // clear role & userId
    navigate("/"); // redirect to login
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      p={4}
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Button
        sx={{ position: "absolute", top: 40, right: 50 }}
        variant="outlined"
        color="secondary"
        onClick={handleLogout}
      >
        Logout
      </Button>
      <Paper sx={{ p: 4, width: 500, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h5" mb={2}>
          Welcome, {user.name}
        </Typography>

        {/* Account Info */}
        <Box mb={3}>
          <Typography variant="subtitle1">
            <b>Bank:</b> State Bank of India
          </Typography>
          <Typography variant="subtitle1">
            <b>Branch:</b> kazhudur
          </Typography>
          <Typography variant="subtitle1">
            <b>IFSC Code:</b> {user.ifsc}
          </Typography>
          <Typography variant="h6" mt={2}>
            Balance: ₹{balance}
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              variant="contained"
              fullWidth
              color="primary"
              onClick={() => setOpenDeposit(true)}
            >
              Deposit
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              fullWidth
              color="error"
              onClick={() => setOpenWithdraw(true)}
            >
              Withdraw
            </Button>
          </Grid>
        </Grid>

        {/* Deposit & Withdraw Dialogs */}
        <DepositDialog
          sendEmail={sendEmail}
          setBalance={setBalance}
          open={openDeposit}
          onClose={() => setOpenDeposit(false)}
          onSuccess={(message) =>
            setSnackbar({ open: true, message, severity: "success" })
          }
        />
        <WithdrawDialog
          sendEmail={sendEmail}
          setBalance={setBalance}
          open={openWithdraw}
          onClose={() => setOpenWithdraw(false)}
          balance={user.balance} // pass current balance
          onSuccess={(message) =>
            setSnackbar({ open: true, message, severity: "success" })
          }
        />

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}
