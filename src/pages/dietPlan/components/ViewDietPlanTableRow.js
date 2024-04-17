import PropTypes from 'prop-types';
import moment from 'moment';
import { TableCell, TableRow, Typography } from '@mui/material';

ViewDietPlanTableRow.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
};

export default function ViewDietPlanTableRow({ row, index }) {
  return (
    <TableRow>
      <TableCell>
        <Typography variant="subtitle2" noWrap ml={1}>
          {index + 1}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2">{row?.notes}</Typography>
      </TableCell>
      <TableCell>{moment.utc(row?.createdAt).format('DD-MM-YYYY')}</TableCell>
    </TableRow>
  );
}
