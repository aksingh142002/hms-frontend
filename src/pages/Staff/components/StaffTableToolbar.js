import Iconify from '@components/iconify';
import { Button, InputAdornment, TextField, Grid, Box, Autocomplete } from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

StaffTableToolbar.propTypes = {
  filterSearch: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  onFilterSearch: PropTypes.func,
  roleData: PropTypes.array,
  role: PropTypes.object,
  onRoleChange: PropTypes.func,
};

export default function StaffTableToolbar({
  filterSearch,
  onFilterName,
  onResetFilter,
  onFilterSearch,
  roleData,

  role,
  onRoleChange,
}) {
  const handleRoleChange = (event, value) => {
    onRoleChange(value);
  };

  const handleResetFilter = () => {
    onResetFilter();
    onRoleChange(null);
  };

  return (
    <Box sx={{ m: 1, mb: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            size="medium"
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
        <Grid item xs={12} sm={3}>
          <Autocomplete
            options={roleData}
            value={role}
            onChange={handleRoleChange}
            getOptionLabel={(option) =>
                    option && option.roleName
                      ? option.roleName.replace(/\b\w/g, (char) => char.toUpperCase())
                      : ''
                  }
            renderInput={(params) => <TextField {...params} label="Role" size="medium" fullWidth />}
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
              onClick={handleResetFilter}
            >
              Reset
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
