import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

export default function UserDetails({ user }) {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" mb={2}>
        User Details
      </Typography>

      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <b>Name</b>
            </TableCell>
            <TableCell>{user.name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <b>Email</b>
            </TableCell>
            <TableCell>{user.email}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <b>Balance</b>
            </TableCell>
            <TableCell>₹ {user.balance}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
}
