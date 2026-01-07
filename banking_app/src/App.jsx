import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import DepositDialog from "./components/DepositDialog.jsx";
import WithdrawDialog from "./components/WithdrawDialog";
import ReportPage from "./pages/ReportPage";
import { NotFound } from "./pages/NotFound.jsx";

const PrivateRoute = ({ children, role }) => {
  const userRole = localStorage.getItem("role");

  if (!userRole) return <Navigate to="/" />;

  if (role && role !== userRole) return <Navigate to="/" />;

  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* User Dashboard */}
        <Route
          path="/user"
          element={
            <PrivateRoute role="user">
              <UserDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/report"
          element={
            <PrivateRoute>
              <ReportPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
