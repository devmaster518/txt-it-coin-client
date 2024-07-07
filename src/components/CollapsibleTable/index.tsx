import { useQuery as useGraphQuery } from '@apollo/client';

import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import Collapse from '@mui/material/Collapse';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { useBoolean } from 'src/hooks/useBoolean';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';

import { FETCH_STATISTICS_QUERY } from 'src/sections/Statistics/query';

// ----------------------------------------------------------------------

export default function CollapsibleTable() {
  const { loading: statisticsLoading, data: statisticsData } = useGraphQuery(
    FETCH_STATISTICS_QUERY,
    {
      variables: {
        page: '1, 1000',
        filter: {},
        sort: 'createdAt',
      },
    }
  );

  const tableData = statisticsData?.statistics;

  return (
    <Paper
      variant="outlined"
      sx={{
        width: '100%',
        m: 0.5,
        mt: 2,
        p: 2,
        borderRadius: 1.5,
      }}
    >
      <Typography variant="subtitle1">TXC Payout</Typography>
      <TableContainer sx={{ mt: 3, overflow: 'unset' }}>
        <Scrollbar>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell align="left">Date</TableCell>
                <TableCell align="left">New Blocks</TableCell>
                <TableCell align="left">Total Blocks</TableCell>
                <TableCell align="left">New Hash Power</TableCell>
                <TableCell align="left">Total Hash Power</TableCell>
                <TableCell align="left">Members</TableCell>
                <TableCell align="left">From</TableCell>
                <TableCell align="left">To</TableCell>
                <TableCell align="left">Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {statisticsLoading ? (
                <LoadingScreen />
              ) : (
                tableData!.statistics!.map((row) => (
                  <CollapsibleTableRow key={row!.id} row={row!} />
                ))
              )}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Paper>
  );
}

// ----------------------------------------------------------------------

type CollapsibleTableRowProps = {
  row: any;
};

function CollapsibleTableRow({ row }: CollapsibleTableRowProps) {
  const collapsible = useBoolean();

  return (
    <>
      <TableRow hover>
        <TableCell>
          <IconButton
            color={collapsible.value ? 'inherit' : 'default'}
            onClick={collapsible.onToggle}
            sx={{ p: 0 }}
            size="small"
          >
            <Iconify
              icon={collapsible.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            />
          </IconButton>
        </TableCell>
        <TableCell align="left">{new Date(row.issuedAt).toISOString().split('T')[0]}</TableCell>
        <TableCell align="left">{row.newBlocks}</TableCell>
        <TableCell align="left">{row.totalBlocks}</TableCell>
        <TableCell align="left">{row.newHashPower}</TableCell>
        <TableCell align="left">{row.totalHashPower}</TableCell>
        <TableCell align="left">{row.members}</TableCell>
        <TableCell align="left">{new Date(row.from).toUTCString()}</TableCell>
        <TableCell align="left">{new Date(row.to).toUTCString()}</TableCell>
        <TableCell align="left">{row.status ? 'Confirmed' : 'Pending'}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell sx={{ py: 0 }} colSpan={12}>
          <Collapse in={collapsible.value} unmountOnExit>
            <Paper
              variant="outlined"
              sx={{
                p: 1,
                borderRadius: 1.5,
                ...(collapsible.value && {
                  boxShadow: (theme) => theme.customShadows.z20,
                }),
              }}
            >
              <Typography variant="subtitle1" sx={{ m: 2 }}>
                History
              </Typography>

              <Table size="small" aria-label="memberStatistics" sx={{ width: '100%' }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Date</TableCell>
                    <TableCell align="left">Username</TableCell>
                    <TableCell align="left">Email</TableCell>
                    <TableCell align="left">Mobile</TableCell>
                    <TableCell align="left">TXC Cold</TableCell>
                    <TableCell align="left">Hash Power</TableCell>
                    <TableCell align="left">Reward</TableCell>
                    <TableCell align="left">Percent</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {row!.memberStatistics!.map((item: any) => (
                    <TableRow hover key={item.id}>
                      <TableCell component="th" scope="row">
                        {new Date(item.issuedAt).toISOString().split('T')[0]}
                      </TableCell>
                      <TableCell align="left">{item.member.username}</TableCell>
                      <TableCell align="left">{item.member.email}</TableCell>
                      <TableCell align="left">{item.member.mobile}</TableCell>
                      <TableCell align="left">{item.member.txcCold}</TableCell>
                      <TableCell align="left">{item.hashPower}</TableCell>
                      <TableCell align="left">{item.txcShared}</TableCell>
                      <TableCell align="left">{item.percent}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
