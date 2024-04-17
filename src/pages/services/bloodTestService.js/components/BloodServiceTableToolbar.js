import Iconify from '@components/iconify';
import { Button, InputAdornment, TextField, Grid, Box } from '@mui/material';
import PropTypes from 'prop-types';

BloodServiceTableToolbar.propTypes = {
  filterSearch: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  onFilterSearch: PropTypes.func,
};

export default function BloodServiceTableToolbar({
  filterSearch,
  onFilterName,
  onResetFilter,
  onFilterSearch,
}) {
  return (
    <Box sx={{ m: 1, mb: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            size="small"
            value={filterSearch}
            onChange={onFilterName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onFilterSearch();
              }
            }}
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={2}>
          <Box sx={{ display: 'flex' }}>
            <Button
              variant="contained"
              onClick={onFilterSearch}
              sx={{
                mt: { xs: 1, sm: 0 },
              }}
            >
              Search
            </Button>

            <Button
              sx={{
                mt: { xs: 1, sm: 0 },
                ml: { xs: 1, sm: 1 },
              }}
              variant="contained"
              onClick={onResetFilter}
            >
              Reset
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
