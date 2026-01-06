import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const VerifyCode = ({ email, onClose }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.post("/verify-otp", {
        email,
        otp,
      });

      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("name", res.data.name);

      navigate(res.data.role === "admin" ? "/admin" : "/user");
      onClose && onClose();
    } catch (err) {
      setError(err.response?.data?.msg || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.dialog}>
        <h3>Email Verification</h3>
        <p>Enter the verification code sent to your email</p>

        <input
          type="text"
          placeholder="Enter 6-digit code"
          value={otp}
          maxLength={6}
          onChange={(e) => setOtp(e.target.value)}
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button
          onClick={handleVerifyOtp}
          disabled={loading || otp.length !== 6}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        <button onClick={onClose} style={styles.cancelBtn}>
          Cancel
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    background: "#fff",
    padding: "24px",
    borderRadius: "8px",
    width: "320px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "12px",
    fontSize: "16px",
  },
  error: {
    color: "red",
    marginTop: "8px",
  },
  cancelBtn: {
    marginTop: "10px",
    background: "transparent",
    border: "none",
    color: "#555",
    cursor: "pointer",
  },
};
