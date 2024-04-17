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
  Link,
  Avatar,
} from '@mui/material';
// components
import ConfirmDialog from '@components/confirm-dialog';
import Iconify from '@components/iconify';
import Label from '@components/label';
import MenuPopover from '@components/menu-popover';
import { useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import Tooltip from '@mui/material/Tooltip';
// ----------------------------------------------------------------------

ResourcesTableRow.propTypes = {
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

export default function ResourcesTableRow({
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
  const { thumbnail, title, type, description, resourceLink, category } = row;

  const { page, limit } = query;

  const { isDeleting } = useSelector((store) => store?.resources);

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

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          <Avatar alt={title} src={thumbnail} />
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          <Typography variant='subtitle2'>
            {title.length > 16 ? (
              <Tooltip title={title} arrow>
                <Typography variant="subtitle2" noWrap sx={{ maxWidth: '200px' }}>
                  {title.substring(0, 16)}...
                </Typography>
              </Tooltip>
            ) : (
              title
            )}
          </Typography>
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          <Typography variant="subtitle2">{type}</Typography>
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          <Typography variant="subtitle2">{type === 'pdf' ? 'N/A' : description}</Typography>
        </TableCell>

        <TableCell align="left">
          {type === 'article' ? (
            <Typography variant='subtitle2'>N/A</Typography>
          ) : (
            <Link href={resourceLink}>
              {type === 'pdf' ? <Iconify icon="ic:round-cloud-download" /> : 'Link'}
            </Link>
          )}
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          <Typography variant="subtitle2">{category?.category}</Typography>
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
