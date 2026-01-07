import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "../api/api.js";
import { useState } from "react";

export default function DepositDialog({
  sendEmail,
  open,
  onClose,
  onSuccess,
  setBalance,
  transactions,
  setTransactions,
}) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setLoading(true);
    const id = localStorage.getItem("userId");
    const res = await axios.post("/bank/deposit", { id, amount });
    setBalance(res.data.balance);
    sendEmail(res.data.message, res.data.mailId);

    // Simulate API call
    setTimeout(() => {
      setTransactions((prev) => [res.data.transaction, ...prev]);
      setLoading(false);
      onClose();
      onSuccess && onSuccess(`Deposited ₹${amount} successfully`);
      setAmount("");
    }, 1500);
    
  };

  const handleCancel = () => {
    setAmount("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="xs" fullWidth>
      <DialogTitle>Deposit Amount</DialogTitle>

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
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleDeposit}
          disabled={loading}
          startIcon={loading && <CircularProgress size={18} />}
        >
          {loading ? "Processing..." : "Deposit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
