import { Button, TextField, Box, Autocomplete } from '@mui/material';
import { emptyPlan } from '@redux/slices/planSlice';
import { dispatch } from '@redux/store';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

PlanListToolbar.propTypes = {
  filterSearch: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  onFilterSearch: PropTypes.func,
  planData: PropTypes.array,
  onPlanChange: PropTypes.func,
};

export default function PlanListToolbar({
  filterSearch,
  onFilterName,
  onResetFilter,
  onFilterSearch,
  planData,
  onPlanChange,
})
{
  const [values, setValues] = useState(null);
  // const autocompleteRef = useRef(null);

  const handlePlanChange = (event, value) =>
  {
    setValues(value)
    onPlanChange(value?._id)

  };
  const handleResetFilter = () =>
  {
    setValues(null);
    onResetFilter();
    dispatch(emptyPlan())
  };
  return (
    <Box sx={{ padding: 1, maxWidth: '500px', display: 'flex' }}>
      <Autocomplete
        options={planData}
        onChange={handlePlanChange}
        value={values}
        getOptionLabel={(option) => option.title}
        sx={{ width: '300px' }}
        renderInput={(params) => <TextField {...params} label="Plan" size="medium" />}
      />
      <Button
        variant="contained"
        onClick={onFilterSearch}
        sx={{
          mt: { xs: 1, sm: 0 },
          width: '100px',
          marginX: '20px',
        }}
      >
        Search
      </Button>
      <Button
        variant="contained"
        onClick={handleResetFilter}
        sx={{
          mt: { xs: 1, sm: 0 },
          width: '100px',
        }}
      >
        Reset
      </Button>
    </Box>
  );
}
