import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function Header({ icon, username, onMenuClick }) {
  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left: Logo + Bank Name */}
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton color="inherit" onClick={onMenuClick}>
            <MenuIcon />
          </IconButton>

          <img
            src="/sbi-logo.png"
            alt="SBI"
            width={36}
            height={36}
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid white",
              padding: "2px",
            }}
          />

          <Typography variant="h6">State Bank of India</Typography>
        </Box>

        {/* Right: User info */}
        <Box display="flex" alignItems="center" gap={1}>
          <Typography>{username}</Typography>
          <Avatar
            src={`http://localhost:5000${icon}`}
            sx={{ width: 40, height: 40 }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
