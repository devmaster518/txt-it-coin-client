import { useMemo, useCallback } from 'react';
import { useQuery as useGraphQuery } from '@apollo/client';

import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';
import TableContainer from '@mui/material/TableContainer';

import { useQuery } from 'src/routes/hooks';
import type { SortOrder } from 'src/routes/hooks/useQuery';

import Scrollbar from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';
import { TableHeadCustom, TablePaginationCustom } from 'src/components/Table';

import { IStatisticsFilters, IStatisticsPrismaFilter } from 'src/types/statistics';

import { FETCH_MEMBERSTATISTICS_QUERY } from './query';

const defaultFilter: IStatisticsFilters = {
  search: '',
  newBlocks: 0,
  totalBlocks: 0,
  newHashPower: 0,
  totalHashPower: 0,
  members: 0,
};

// ----------------------------------------------------------------------

type RowDataType = {
  id: string;
  hashPower: number;
  percent: number;
  txcShared: number;
  issuedAt: string;
  member: {
    username: string;
    txcCold: string;
    assetId: string;
  };
  statistics: {
    newBlocks: number;
    newHashPower: number;
    status: boolean;
  };
};

const TABLE_HEAD = [
  { id: 'issuedAt', label: 'Date', align: 'left' },
  { id: 'hashPower', label: 'Hash Power', align: 'left' },
  { id: 'percent', label: 'Percent', align: 'left' },
  { id: 'txcShared', label: 'TXCShared', align: 'left' },
  { id: 'username', label: 'Username', align: 'left' },
  { id: 'txcCold', label: 'TXC-Cold', align: 'left' },
  { id: 'assetId', label: 'AssetId', align: 'left' },
  { id: 'newBlocks', label: 'New Blocks', align: 'left' },
  { id: 'newHashPower', label: 'New Hash Power', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
];

interface Props {
  title: string;
  changeStatus: Function;
}

// ----------------------------------------------------------------------

export default function TxcTable({ title, changeStatus }: Props) {
  const [query, setQuery] = useQuery<IStatisticsFilters>();

  const { page = { page: 1, pageSize: 10 }, sort, filter = defaultFilter } = query;

  const graphQueryFilter = useMemo(() => {
    const filterObj: IStatisticsPrismaFilter = {};

    if (filter.search) {
      filterObj.OR = [{}];
    }

    filterObj.OR = [{ issuedAt: new Date(new Date().toISOString().split('T')[0]) }];

    return filterObj;
  }, [filter]);

  const graphQuerySort = useMemo(() => {
    if (!sort) return undefined;

    return Object.entries(sort)
      .map(([key, value]) => `${value === 'asc' ? '' : '-'}${key}`)
      .join(',');
  }, [sort]);

  const { loading, data } = useGraphQuery(FETCH_MEMBERSTATISTICS_QUERY, {
    variables: {
      page: page && `${page.page},${page.pageSize}`,
      filter: graphQueryFilter,
      sort: graphQuerySort,
    },
  });

  const tableData: RowDataType[] = loading
    ? []
    : (data!.memberStatistics!.memberStatistics!.filter(
        (item: any) => item !== null
      ) as RowDataType[]);

  const handlePageChange = useCallback(
    (name: string, value: number) => {
      setQuery({ ...query, page: { ...page, [name]: value } });
    },
    [setQuery, query, page]
  );

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ pl: 3, pr: 3, pt: 2, pb: 2 }}
      >
        <Typography variant="subtitle1">{title}</Typography>
        <ButtonGroup variant="contained" color="primary" onClick={() => changeStatus(true)}>
          <Button>Confirm</Button>
        </ButtonGroup>
      </Stack>

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size="small" sx={{ minWidth: 800 }}>
            <TableHeadCustom
              order={sort && sort[Object.keys(sort)[0]]}
              orderBy={sort && Object.keys(sort)[0]}
              headLabel={TABLE_HEAD}
              rowCount={loading ? 0 : tableData!.length}
              onSort={(id) => {
                const isAsc = sort && sort[id] === 'asc';
                const newSort = { [id]: isAsc ? 'desc' : ('asc' as SortOrder) };
                setQuery({ ...query, sort: newSort });
              }}
            />
            {loading ? (
              <LoadingScreen />
            ) : (
              <TableBody>
                {tableData!.map((row) => (
                  <TableRow hover key={row.id}>
                    <TableCell> {new Date(row.issuedAt).toISOString().split('T')[0]} </TableCell>
                    <TableCell align="left">{row.hashPower}</TableCell>
                    <TableCell align="left">{row.percent}</TableCell>
                    <TableCell align="left">{row.txcShared}</TableCell>
                    <TableCell align="left">{row.member?.username}</TableCell>
                    <TableCell align="left">{row.member?.txcCold}</TableCell>
                    <TableCell align="left">{row.member?.assetId}</TableCell>
                    <TableCell align="left">{row.statistics?.newBlocks}</TableCell>
                    <TableCell align="left">{row.statistics?.newHashPower}</TableCell>
                    <TableCell align="left">
                      {row.statistics?.status ? 'Confirmed' : 'Pending'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={loading ? 0 : data!.memberStatistics!.total!}
        page={loading ? 0 : page!.page - 1}
        rowsPerPage={page?.pageSize}
        onPageChange={(_, curPage) => {
          handlePageChange('page', curPage + 1);
        }}
        onRowsPerPageChange={(event) => {
          handlePageChange('pageSize', parseInt(event.target.value, 10));
        }}
      />
    </>
  );
}
