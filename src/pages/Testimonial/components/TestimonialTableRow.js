import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSelector } from 'react-redux';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Button,
  IconButton,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
// components
import ConfirmDialog from '@components/confirm-dialog';
import Iconify from '@components/iconify';
import Label from '@components/label';
import MenuPopover from '@components/menu-popover';
import Tooltip from '@mui/material/Tooltip';

// ----------------------------------------------------------------------

TestimonialTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  index: PropTypes.number,
  query: PropTypes.object,
  modulePermit: PropTypes.object,
};

export default function TestimonialTableRow({
  row,
  index,
  selected,
  onEditRow,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  query,
  modulePermit,
}) {
  const { title, description, image, planId, name, age, weight, duration } = row;
  const { page, limit } = query;
  const { isDeleting } = useSelector((store) => store?.testimonial);
  const [plan, setPlan] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align="left">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle2" noWrap ml={1}>
            {(page - 1) * limit + (index + 1)}
          </Typography>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={image} />
          </Stack>
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          <Typography variant="subtitle2">{title}</Typography>
        </TableCell>

        <TableCell align="left">
          {planId?.title.length > 16 ? (
            <Tooltip title={planId?.title} arrow>
              <Typography variant="subtitle2" noWrap sx={{ maxWidth: '200px' }}>
                {planId?.title.substring(0, 16)}...
              </Typography>
            </Tooltip>
          ) : (
              <Typography variant='subtitle2'>planId?.title</Typography>
          )}
        </TableCell>
        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          <Typography variant="subtitle2">{age}</Typography>
        </TableCell>
        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {weight ? <Typography variant="subtitle2">{weight}</Typography> : 'N/A'}
        </TableCell>
        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          <Typography variant="subtitle2">{duration}</Typography>
        </TableCell>
        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {description.length > 16 ? (
            <Tooltip title={description} arrow>
              <Typography variant="subtitle2" noWrap sx={{ maxWidth: '200px' }}>
                {description.substring(0, 16)}...
              </Typography>
            </Tooltip>
          ) : (
              <Typography variant='subtitle2'>description</Typography>
          )}
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="carbon:view-filled" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
          disabled={!modulePermit.edit}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
          disabled={!modulePermit.delete}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <LoadingButton
            loading={isDeleting}
            variant="contained"
            color="error"
            onClick={() => onDeleteRow(handleCloseConfirm)}
          >
            Delete
          </LoadingButton>
        }
      />
    </>
  );
}
