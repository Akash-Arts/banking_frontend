import { Box, Snackbar, Alert, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DepositDialog from "../components/DepositDialog.jsx";
import WithdrawDialog from "../components/WithdrawDialog.jsx";
import emailjs from "@emailjs/browser";
import axios from "../api/api.js";
import Header from "../components/Header.jsx";
import Sidebar from "../components/SideBar.jsx";
import UserDetails from "../components/UserDetails.jsx";
import HistoryTabs from "../components/HistoryTabs.jsx";

export default function UserDashboard() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reports, setReports] = useState({});
  const [transactions, setTransactions] = useState({});
  const [user, setUser] = useState({});
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const [openDeposit, setOpenDeposit] = useState(false);
  const [openWithdraw, setOpenWithdraw] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const sendEmail = (msg, mailId) => {
    emailjs.send(
      "service_z4hhz0n",
      "template_zxczmd9",
      { message: msg, user_email: mailId },
      "wHoxCfPlxyWe8PvfZ"
    );
  };
  const fetchReports = async () => {
    const userId = localStorage.getItem("userId");
    const res = await axios.get(`/report/user/${userId}`);
    console.log("log", res);
    setReports(res.data.reports);
  };

  const fetchTransactions = async () => {
    const userId = localStorage.getItem("userId");
    const res = await axios.get(`/transaction/user/${userId}`);
    setTransactions(res.data.transactions);
  };

  const fetchUser = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      const res = await axios.get(`/bank/user/${userId}`);
      setUser(res.data.user);
      setBalance(res.data.user.balance);
    } catch {
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
    fetchReports();
    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Header
        icon={user.profilePic}
        username={user.name}
        onMenuClick={() => setSidebarOpen(true)}
      />

      <Box display="flex">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onDeposit={() => {
            setOpenDeposit(true);
            setSidebarOpen(false);
          }}
          onWithdraw={() => {
            setOpenWithdraw(true);
            setSidebarOpen(false);
          }}
          onLogout={() => {
            localStorage.clear();
            navigate("/");
          }}
        />

        <Box flex={1} p={3}>
          <UserDetails user={user} />
          <HistoryTabs transactions={transactions} reports={reports} />
        </Box>
      </Box>

      {/* Deposit Dialog */}
      <DepositDialog
        open={openDeposit}
        setBalance={setBalance}
        transactions={transactions}
        setTransactions={setTransactions}
        sendEmail={sendEmail}
        onClose={() => setOpenDeposit(false)}
        onSuccess={(msg) =>
          setSnackbar({ open: true, message: msg, severity: "success" })
        }
      />

      {/* Withdraw Dialog */}
      <WithdrawDialog
        open={openWithdraw}
        balance={balance}
        setBalance={setBalance}
        transactions={transactions}
        setTransactions={setTransactions}
        sendEmail={sendEmail}
        onClose={() => setOpenWithdraw(false)}
        onSuccess={(msg) =>
          setSnackbar({ open: true, message: msg, severity: "success" })
        }
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
}
