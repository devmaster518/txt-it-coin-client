import { useQuery as useGraphQuery } from '@apollo/client';

import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';

import ChartWidget from 'src/components/ChartWidget';
import { useSettingsContext } from 'src/components/settings';
import CollapsibleTable from 'src/components/CollapsibleTable';

import { FETCH_STATISTICS_QUERY } from './query';

export default function HistoryView() {
  const settings = useSettingsContext();

  const { loading: statisticsLoading, data: statisticsData } = useGraphQuery(
    FETCH_STATISTICS_QUERY,
    {
      variables: {
        page: '1,20',
      },
    }
  );

  const statistics = statisticsLoading ? { statistics: [], total: 0 } : statisticsData?.statistics;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <ChartWidget
            title="Daily"
            chart={{
              categories: statistics?.statistics!.map(
                (item) => new Date(item!.issuedAt).toISOString().split('T')[0]
              ),
              series: [
                {
                  data: [
                    {
                      name: 'New Blocks',
                      data: statistics!.statistics!.map((item) => item!.newBlocks),
                    },
                    {
                      name: 'New Hash Power',
                      data: statistics!.statistics!.map((item) => item!.newHashPower),
                    },
                  ],
                },
              ],
              options: {
                plotOptions: {
                  bar: {
                    columnWidth: '16%',
                  },
                },
              },
            }}
            type="bar"
          />
        </Grid>
        <Grid xs={12} md={6}>
          <ChartWidget
            title="TXC Shared"
            chart={{
              categories: statistics?.statistics!.map(
                (item) => new Date(item!.issuedAt).toISOString().split('T')[0]
              ),
              series: [
                {
                  data: [
                    {
                      name: 'Daily Reward',
                      data: statistics!.statistics!.map((item) => item!.newBlocks * 254),
                    },
                  ],
                },
              ],
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
