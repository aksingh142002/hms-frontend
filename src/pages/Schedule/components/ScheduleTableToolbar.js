import {
  Button,
  TextField,
  Grid,
  Box,
  Autocomplete,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import PropTypes from 'prop-types';

ScheduleTableToolbar.propTypes = {
  filterSearch: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  onFilterSearch: PropTypes.func,
  staffData: PropTypes.array,
  staff: PropTypes.object,
  onStaffChange: PropTypes.func,
  startDate: PropTypes.instanceOf(Date),
  onStartDateChange: PropTypes.func,
  endDate: PropTypes.instanceOf(Date),
  onEndDateChange: PropTypes.func,
};

export default function ScheduleTableToolbar({
  filterSearch,
  onFilterName,
  onResetFilter,
  onFilterSearch,
  staffData,
  staff,
  onStaffChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
}) {
  const handleStaffChange = (event, value) => {
    onStaffChange(value);
  };

  const StandardDateTime = (date) => {

    // Add 5 hours and 30 minutes to the date
    const newDate = new Date(date.getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000);
    return newDate;
  };

  const handleStartDateChange = (date) => {
    onStartDateChange(StandardDateTime(date));
  };

  const handleEndDateChange = (date) => {
    onEndDateChange(StandardDateTime(date));
  };
  const handleResetFilter = () => {
    onResetFilter();
    onStaffChange(null); // Clear the selected staff
    onStartDateChange(null); // Clear the start date
    onEndDateChange(null); // Clear the end date
  };
  return (
    <Box sx={{ m: 1, mb: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <Autocomplete
            options={staffData}
            value={staff}
            onChange={handleStaffChange}
            getOptionLabel={(option) =>
              option && option.name
                ?`${option.name.replace(/\b\w/g, (char) => char.toUpperCase())} (${option.role.roleName.replace(/\b\w/g, (char) => char.toUpperCase())})`
                : ''
            }
            renderInput={(params) => <TextField {...params} label="Staff" size="medium" />}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={handleStartDateChange}
            format="dd/MM/yyyy"
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={handleEndDateChange}
            format="dd/MM/yyyy"
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
