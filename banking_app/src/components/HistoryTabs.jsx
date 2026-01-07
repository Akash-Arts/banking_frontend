import {
  Tabs,
  Tab,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import { useState } from "react";

export default function HistoryTabs({ transactions = [], reports = [] }) {
  const [tab, setTab] = useState(0);

  return (
    <Paper sx={{ p: 2 }}>
      <Tabs value={tab} onChange={(e, v) => setTab(v)}>
        <Tab label="Transaction History" />
        <Tab label="Report History" />
      </Tabs>

      {/* Transactions */}
      {tab === 0 && (
        <Box mt={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date </TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.length ? (
                transactions.map((t, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      {new Date(t.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>{t.type}</TableCell>
                    <TableCell>₹ {t.amount}</TableCell>
                    <TableCell>₹ {t.balanceAfter}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No transactions
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      )}

      {/* Reports */}
      {tab === 1 && (
        <Box mt={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date </TableCell>
                <TableCell>Complient</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.length ? (
                reports.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      {new Date(r.updatedAt).toLocaleString()}
                    </TableCell>
                    <TableCell>{r.subject}</TableCell>
                    <TableCell>{r.status}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No reports
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      )}
    </Paper>
  );
}
