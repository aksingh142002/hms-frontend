import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
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

// ----------------------------------------------------------------------

FaqTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  index: PropTypes.number,
  query: PropTypes.object,
  // modulePermit: PropTypes.object,
};

export default function FaqTableRow({
  row,
  selected,
  onEditRow,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  index,
  query,
  // modulePermit,
}) {
  const { question, answer, createdBy } = row;
  const { page, limit } = query;
  const [openConfirm, setOpenConfirm] = useState(false);
  const [show, setShow] = useState(false);

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

  const toggleShow = () => {
    setShow((prev) => !prev);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* <Avatar alt={name} src={avatarUrl} /> */}

            <Typography variant="subtitle2" noWrap>
              {(page - 1) * limit + (index + 1)}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">
          <Typography variant="subtitle2">{question}</Typography>
        </TableCell>

        <TableCell align="left">
          <Typography variant="subtitle2" sx={{ width: 700 }}>
            {show ? answer : `${answer.slice(0, 150)}${answer.length > 150 ? '...' : ''}`}
            {answer.length > 150 && (
              <Button color="primary" size="small" onClick={toggleShow}>
                {show ? 'Show less' : 'Show more'}
              </Button>
            )}
          </Typography>
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
          // disabled={!modulePermit.edit}
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
          // disabled={!modulePermit.delete}
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
          <Button variant="contained" color="error" onClick={() => onDeleteRow(handleCloseConfirm)}>
            Delete
          </Button>
        }
      />
    </>
  );
}