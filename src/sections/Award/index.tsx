import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';

import Preview from './Preview';

// ----------------------------------------------------------------------

export default function AwardView() {
  return (
    <Grid container spacing={1}>
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          width: 1,
        }}
      >
        <Preview />
      </Paper>
    </Grid>
  );
}
