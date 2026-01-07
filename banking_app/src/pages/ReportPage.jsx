import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "../api/api";
import { useNavigate } from "react-router-dom";

export default function ReportPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fromDate: "",
    toDate: "",
    subject: "",
    message: "",
  });

  const [reports, setReports] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitReport = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const res = await axios.post("/report/create", {
        ...form,
        userId,
      });

      setReports([res.data.report, ...reports]);

      setSnackbar({
        open: true,
        message: "Report submitted successfully",
        severity: "success",
      });

      setForm({ fromDate: "", toDate: "", subject: "", message: "" });
      setTimeout(() => {
        navigate("/user");
      }, 1200);
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to submit report",
        severity: "error",
      });
    }
  };

  return (
    <Box p={4} bgcolor="#f5f5f5" minHeight="100vh">
      <Paper sx={{ p: 4, maxWidth: 700, mx: "auto" }}>
        <Typography variant="h5" mb={2}>
          Raise a Report
        </Typography>

        <Grid container spacing={2}>
          <Grid size={6}>
            <TextField
              label="From Date"
              type="date"
              fullWidth
              name="fromDate"
              InputLabelProps={{ shrink: true }}
              value={form.fromDate}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={6}>
            <TextField
              label="To Date"
              type="date"
              fullWidth
              name="toDate"
              InputLabelProps={{ shrink: true }}
              value={form.toDate}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              label="Subject"
              fullWidth
              name="subject"
              value={form.subject}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              label="Message"
              fullWidth
              multiline
              rows={4}
              name="message"
              value={form.message}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={submitReport}
          disabled={!form.subject || !form.message}
        >
          Submit Report
        </Button>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
