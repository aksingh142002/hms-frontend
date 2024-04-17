/* eslint-disable no-nested-ternary */

import PropTypes from 'prop-types';
import { Box, CircularProgress, TableCell, TableRow } from '@mui/material';
import EmptyContent from '../empty-content';

TableNoData.propTypes = {
  isNotFound: PropTypes.number,
  isLoading: PropTypes.bool,
};

export default function TableNoData({ isNotFound, isLoading }) {
  return (
    <TableRow>
      <TableCell colSpan={12} sx={{ p: 0 }}>
        {isLoading ? (
          <Box
            sx={{
              height: '20vh',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',    
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        ) : isNotFound === 0 ? (
          <EmptyContent
            title="No Data"
            sx={{
              '& span.MuiBox-root': { height: 160 },
            }}
          />
        ) : null}
      </TableCell>
    </TableRow>
  );
}
