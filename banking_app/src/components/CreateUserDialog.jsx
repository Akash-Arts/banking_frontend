import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress
} from "@mui/material";
import { useState } from "react";
import axios from "../api/api";

export default function CreateUserDialog({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    balance: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      setLoading(true);

      await axios.post("/auth/create-user", {
        name: form.name,
        email: form.email,
        password: form.password,
        balance: Number(form.balance),
        role: "user"
      });

      onSuccess("User created successfully");
      onClose();

      setForm({ name: "", email: "", password: "", balance: "" });
    } catch (error) {
      onSuccess(
        error.response?.data?.msg || "Failed to create user",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Create User</DialogTitle>

      <DialogContent>
        <TextField
          margin="dense"
          label="Name"
          name="name"
          fullWidth
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Email"
          name="email"
          fullWidth
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Password"
          name="password"
          type="password"
          fullWidth
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Initial Balance"
          name="balance"
          type="number"
          fullWidth
          onChange={handleChange}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={loading}
        >
          {loading ? <CircularProgress size={22} /> : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
