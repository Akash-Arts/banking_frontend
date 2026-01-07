import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Avatar,
  Box,
} from "@mui/material";
import { useState } from "react";
import axios from "../api/api";

export default function CreateUserDialog({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    balance: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleCreate = async () => {
    try {
      setLoading(true);

      const data = new FormData();
      data.append("name", form.name);
      data.append("email", form.email);
      data.append("password", form.password);
      data.append("balance", Number(form.balance));
      data.append("role", "user");
      if (image) data.append("profilePic", image);

      await axios.post("/auth/create-user", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onSuccess("User created successfully");
      onClose();

      setForm({ name: "", email: "", password: "", balance: "" });
      setImage(null);
      setPreview(null);
    } catch (error) {
      onSuccess(error.response?.data?.msg || "Failed to create user", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Create User</DialogTitle>

      <DialogContent>
        {/* 🖼 Profile Preview */}
        <Box display="flex" justifyContent="center" mb={2}>
          <Avatar src={preview} sx={{ width: 80, height: 80 }} />
        </Box>

        <Button component="label" fullWidth variant="outlined">
          Upload Profile Picture
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>

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
        <Button variant="contained" onClick={handleCreate} disabled={loading}>
          {loading ? <CircularProgress size={22} /> : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
