import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { useNavigate } from "react-router-dom";

export default function Sidebar({
  open,
  onClose,
  onDeposit,
  onWithdraw,
  onLogout,
}) {
  const navigate = useNavigate();
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      transitionDuration={300}
      PaperProps={{ sx: { width: 260 } }}
    >
      <Box display="flex" flexDirection="column" height="100%">
        {/* Header */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          px={2}
          py={1.5}
        >
          <Typography variant="h6">Menu</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        {/* Menu */}
        <List>
          <ListItem button onClick={onDeposit}>
            <ListItemIcon>  
              <AccountBalanceIcon />
            </ListItemIcon>
            <ListItemText primary="Deposit" />
          </ListItem>

          <ListItem button onClick={onWithdraw}>
            <ListItemIcon>
              <SwapHorizIcon />
            </ListItemIcon>
            <ListItemText primary="Withdraw" />
          </ListItem>

          <ListItem
            button
            onClick={() => {
              navigate("/user/report");
              onClose();
            }}
          >
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary="Reports" />
          </ListItem>
        </List>

        <Box flexGrow={1} />

        <Divider />

        {/* Logout */}
        <List>
          <ListItem
            button
            onClick={onLogout}
            sx={{
              color: "error.main",
              "&:hover": { backgroundColor: "rgba(211,47,47,0.08)" },
            }}
          >
            <ListItemIcon sx={{ color: "error.main" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
