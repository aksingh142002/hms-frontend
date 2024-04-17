import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Button,
  Checkbox,
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
import { useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

ServicesTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  query: PropTypes.object,
  index: PropTypes.number,
  modulePermit: PropTypes.object,
};

export default function ServicesTableRow({
  row,
  selected,
  onEditRow,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  index,
  query,
  modulePermit,
}) {
  const { title, noOfTests, preparations, testMode, sampleRequired, basePrice, discountPrice } =
    row;

  const { page, limit } = query;

  const { isDeleting } = useSelector((store) => store?.service);

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
      <TableRow hover>
        <TableCell>
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle2" noWrap ml={1}>
            {(page - 1) * limit + (index + 1)}
          </Typography>
        </TableCell>
        <TableCell sx={{ textTransform: 'capitalize' }}>
          <Typography variant="subtitle2">{title}</Typography>
        </TableCell>

        <TableCell align="left">
          <Typography variant="subtitle2">{noOfTests}</Typography>
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          <Typography variant="subtitle2">{preparations}</Typography>
        </TableCell>

        <TableCell align="left">
          <Typography variant="subtitle2">{testMode}</Typography>
        </TableCell>
        <TableCell align="left">
          <Typography variant="subtitle2">{sampleRequired}</Typography>
        </TableCell>
        <TableCell align="left">
          <Typography variant="subtitle2">{basePrice}</Typography>
        </TableCell>
        <TableCell align="left">
          <Typography variant="subtitle2">{discountPrice}</Typography>
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