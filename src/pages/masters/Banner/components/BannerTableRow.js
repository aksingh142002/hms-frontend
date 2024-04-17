import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Avatar,
  Button,
  Checkbox,
  IconButton,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
  Typography,
  Tooltip,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSelector } from 'react-redux';
// components
import ConfirmDialog from '@components/confirm-dialog';
import Iconify from '@components/iconify';
import Label from '@components/label';
import MenuPopover from '@components/menu-popover';
import Image from '@components/image';
import Play from '@assets/play.svg';
// ----------------------------------------------------------------------

RowTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onStatusChange: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onPermissionsRow: PropTypes.func,
  query: PropTypes.object,
  index: PropTypes.number,
  modulePermit: PropTypes.object,
};

export default function RowTableRow({
  row,
  selected,
  onEditRow,
  onStatusChange,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  onPermissionsRow,
  query,
  index,
  modulePermit,
}) {
  const { title, description, image, link, type, status, createdBy, updatedBy } = row;
  const { page, limit } = query;
  const { isDeleting } = useSelector((store) => store?.banner);
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
  const handleCopy = (data) => {
    navigator.clipboard.writeText(data);
  };
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
        <TableCell sx={{ width: '10px' }}>
          <Typography variant="subtitle2" noWrap ml={1}>
            {(page - 1) * limit + (index + 1)}
          </Typography>
        </TableCell>

        <TableCell align="left">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Image
              disabledEffect
              visibleByDefault
              alt={title}
              src={type === 'video' ? Play : image}
              sx={{ borderRadius: 1.5, width: 48, height: 48 }}
            />
          </Stack>
        </TableCell>
        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          <Typography variant="subtitle2">{title}</Typography>
        </TableCell>
        <TableCell align="left">
          <Label variant="soft" sx={{ textTransform: 'capitalize' }}>
            <Typography variant="subtitle2">{type}</Typography>
          </Label>
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          <Typography variant="subtitle2">{description}</Typography>
        </TableCell>

        <TableCell align="left">
          {link ? (
            <Label variant="soft" sx={{ textTransform: 'none' }}>
              <Tooltip
                title={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2">{link}</Typography>
                    <IconButton onClick={() => handleCopy(link)} size="small">
                      <Iconify icon="mingcute:copy-line" />
                    </IconButton>
                  </div>
                }
                arrow
              >
                <Typography variant="body2" noWrap>
                  {link.substring(0, 20)}
                  {link.length > 20 ? '...' : ''}
                </Typography>
              </Tooltip>
            </Label>
          ) : (
            'N/A'
          )}
        </TableCell>
        <TableCell>
          <Button
            sx={{ width: 90 }}
            variant="contained"
            color={status === 'Active' ? 'primary' : 'warning'}
            onClick={onStatusChange}
          >
            {status}
          </Button>
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
            variant="contained"
            loading={isDeleting}
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
