import { useMemo } from 'react';
import { useQuery as useGraphQuery } from '@apollo/client';

import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';

import { useQuery } from 'src/routes/hooks';

import ChartWidget from 'src/components/ChartWidget';
import WidgetSummary from 'src/components/WidgetSummary';
import CollapsibleTable from 'src/components/CollapsibleTable';

import { IStatisticsFilters, IStatisticsPrismaFilter } from 'src/types/statistics';

import {
  FETCH_BLOCKS_QUERY,
  FETCH_MEMBERS_COUNT,
  FETCH_MEMBERS_BY_DATE,
  FETCH_STATISTICS_QUERY,
} from './query';

const defaultFilter: IStatisticsFilters = {
  search: '',
  newBlocks: 0,
  totalBlocks: 0,
  newHashPower: 0,
  totalHashPower: 0,
  members: 0,
};

export default function StatisticsSection() {
  const theme = useTheme();

  const [query] = useQuery<IStatisticsFilters>();

  const { filter = defaultFilter } = query;

  const graphQueryFilter = useMemo(() => {
    const filterObj: IStatisticsPrismaFilter = {};

    if (filter.search) {
      filterObj.OR = [{}];
    }

    return filterObj;
  }, [filter]);

  const { loading: statisticsLoading, data: statisticsData } = useGraphQuery(
    FETCH_STATISTICS_QUERY,
    {
      variables: {
        page: '1,1000',
        filter: graphQueryFilter,
        sort: '-createdAt',
      },
    }
  );

  const { loading: blockLoading, data: blocksData } = useGraphQuery(FETCH_BLOCKS_QUERY, {
    variables: {
      page: '1,1000',
      filter: graphQueryFilter,
      sort: 'blockNo',
    },
  });

  const { loading: memberLoading, data: members } = useGraphQuery(FETCH_MEMBERS_COUNT);

  const { loading: rateLoading, data: membersRate } = useGraphQuery(FETCH_MEMBERS_BY_DATE);

  const today = new Date().toLocaleDateString('en-CA').split('T')[0];

  const statistics = statisticsLoading ? { statistics: [], total: 0 } : statisticsData?.statistics;
  const blocks = blockLoading ? { blocks: [], total: 0 } : blocksData?.blocks;
  const membersGroupByDate = rateLoading
    ? { rates: [], total: 0 }
    : membersRate?.membersGroupByDate;

  const newBlocks = blocks!.blocks!.reduce(
    (prev, item) => (item?.createdAt > today ? prev + 1 : prev),
    0
  );

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <WidgetSummary
            title="Total Blocks"
            percent={2.6}
            total={blocks!.total!}
            chart={{
              colors: [theme.palette.primary.light, theme.palette.primary.main],
              series: statistics!.statistics!.map((item) => item!.totalBlocks),
            }}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <WidgetSummary
            title="New Blocks"
            percent={-0.1}
            total={newBlocks}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: statistics!.statistics!.map((item) => item!.newBlocks),
            }}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <WidgetSummary
            title="Members"
            percent={0.6}
            total={memberLoading ? 0 : members!.members!.total!}
            chart={{
              colors: [theme.palette.secondary.light, theme.palette.secondary.main],
              series: membersGroupByDate!.rates!.map((item) => item!.count),
            }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <ChartWidget
            key="hashRate"
            title="Hashrate"
            chart={{
              categories: blocks!.blocks!.map((item) => item?.blockNo!),
              series: [
                {
                  data: [
                    {
                      name: 'Hashrate',
                      data: blocks!.blocks!.map((item) =>
                        Math.floor(1000 * (item?.hashRate! || 1))
                      ),
                    },
                  ],
                },
              ],
              options: {
                xaxis: {
                  tickAmount: 20,
                },
              },
            }}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <ChartWidget
            key="difficulty"
            title="Network Difficulty"
            chart={{
              colors: ['#ffb136'],
              categories: blocks!.blocks!.map((item) => item?.blockNo!),
              series: [
                {
                  data: [
                    {
                      name: 'Pos Difficulty',
                      data: blocks!.blocks!.map((item) =>
                        Math.floor(1000 * (item?.difficulty! || 1))
                      ),
                    },
                  ],
                },
              ],
              options: {
                xaxis: {
                  tickAmount: 20,
                },
              },
            }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <CollapsibleTable />
      </Grid>
    </Container>
  );
}
