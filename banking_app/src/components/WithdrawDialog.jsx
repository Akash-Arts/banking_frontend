import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { useState } from "react";
import axios from "../api/api.js";

export default function WithdrawDialog({
  open,
  sendEmail,
  onClose,
  onSuccess,
  setBalance,
  balance = 0,
}) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Step 1: Click Withdraw → show confirmation
  const handleWithdraw = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Enter a valid amount");
      return;
    }
    if (Number(amount) > balance) {
      alert("Insufficient balance");
      return;
    }
    setConfirmOpen(true);
  };

  // Step 2: Confirm → process withdrawal
  const handleConfirm = async () => {
    setLoading(true);

    const id = localStorage.getItem("userId");
    const res = await axios.post("/bank/withdraw", { id, amount });
    setBalance(res.data.balance);
    sendEmail(res.data.message, res.data.mailId);
    setTimeout(() => {
      setLoading(false);
      setConfirmOpen(false);
      onClose();
      onSuccess && onSuccess(`Withdrawn ₹${amount} successfully`);
      setAmount("");
    }, 1500);
  };

  const handleCancel = () => {
    setAmount("");
    setConfirmOpen(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="xs" fullWidth>
      {!confirmOpen ? (
        <>
          <DialogTitle>Withdraw Amount</DialogTitle>
          <DialogContent>
            <Box mt={1}>
              <TextField
                label="Amount"
                type="number"
                fullWidth
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
              />
              <Typography
                variant="caption"
                color="textSecondary"
                mt={1}
                display="block"
              >
                Available balance: ₹{balance}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleWithdraw}
              disabled={loading}
            >
              Withdraw
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogTitle>Confirm Withdrawal</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to withdraw ₹{amount}?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setConfirmOpen(false)} disabled={loading}>
              Back
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirm}
              disabled={loading}
              startIcon={loading && <CircularProgress size={18} />}
            >
              {loading ? "Processing..." : "Confirm"}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
