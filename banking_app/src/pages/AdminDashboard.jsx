import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Typography,
  Avatar,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateUserDialog from "../components/CreateUserDialog";
import axios from "../api/api.js";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear(); // clear role & userId
    navigate("/"); // redirect to login
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/bank/admin/getusers");
      setUsers(res.data.users);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to fetch users",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box p={3}>
      <Box
        component={Paper}
        elevation={3}
        sx={{
          p: 2,
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: 2,
        }}
      >
        {/* Left Section */}
        <Box sx={{ display: "flex", flexDirection: "row" , justifyContent:"center", alignItems:'center'}}>
          <img
            src="/intech-icon.png"
            alt="SBI"
            width={36}
            height={36}
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid white",
              padding: "2px",
              marginRight:"5px"
            }}
          />
          <Typography variant="h5" fontWeight="bold">
            Admin Dashboard
          </Typography>
        </Box>

        {/* Right Section */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreate(true)}
          >
            Create User
          </Button>

          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Stack>
      </Box>

      {loading ? (
        <Box textAlign="center">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>picture</b>
                </TableCell>
                <TableCell>
                  <b>Name</b>
                </TableCell>
                <TableCell>
                  <b>Email</b>
                </TableCell>
                <TableCell>
                  <b>Balance</b>
                </TableCell>

                <TableCell>
                  <b>Created At</b>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <Avatar
                        src={`http://localhost:5000${user.profilePic}`}
                        sx={{ width: 40, height: 40 }}
                      />
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>₹ {user.balance}</TableCell>

                    <TableCell>
                      {new Date(user.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
      <CreateUserDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={(message, severity = "success") => {
          setSnackbar({ open: true, message, severity });
          fetchUsers();
        }}
      />
    </Box>
  );
}
