import PropTypes from 'prop-types';
import { useState, Fragment } from 'react';

import {
  Avatar,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  IconButton,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';

import ConfirmDialog from '@components/confirm-dialog';
import Iconify from '@components/iconify';
import Label from '@components/label';
import MenuPopover from '@components/menu-popover';
import moment from 'moment/moment';

FeedbackTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  query: PropTypes.object,
  index: PropTypes.number,
};

export default function FeedbackTableRow({
  row,
  selected,
  onEditRow,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  query,
  index,
}) {
  const { feedback, screenshots } = row;
  const { page, limit } = query;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [isImageOpen, setIsImageOpen] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);
  const [show, setShow] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const handleImageClick = (i) => {
    setIsImageOpen(true);
    setCurrentImageIndex(i);
  };

  const handleCloseImage = () => {
    setIsImageOpen(false);
  };

  const toggleShow = () => {
    setShow((prev) => !prev);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>
          <Typography variant="subtitle2" noWrap ml={1}>
            {(page - 1) * limit + (index + 1)}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle2" sx={{ width: 700 }}>
            {show ? feedback : `${feedback.slice(0, 150)}${feedback.length > 150 ? '...' : ''}`}
            {feedback.length > 150 && (
              <Button color="primary" size="small" onClick={toggleShow}>
                {show ? 'Show less' : 'Show more'}
              </Button>
            )}
          </Typography>
        </TableCell>
        <TableCell style={{ display: 'flex', gap: '5px' }}>
          {screenshots && screenshots.length > 0 ? (
            screenshots.map((shot, i) => (
              <Fragment key={i}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  onClick={() => handleImageClick(i)}
                >
                  <Avatar alt={feedback} src={shot} style={{ borderRadius: '10%' }} />
                </Stack>

                <Dialog open={isImageOpen && currentImageIndex === i} onClose={handleCloseImage}>
                  <DialogContent
                    sx={{
                      pt: '15px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="h6">ScreenShot</Typography>
                    <IconButton onClick={handleCloseImage}>
                      <Iconify icon="material-symbols:cancel" />
                    </IconButton>
                  </DialogContent>
                  <DialogContent
                    sx={{
                      width: { xs: 'auto', sm: 'auto', md: 'auto', lg: 350 },
                      height: 500,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '20px',
                    }}
                  >
                    <img
                      src={shot}
                      alt={feedback}
                      style={{ width: '100%', height: '100%', borderRadius: '10px' }}
                    />
                  </DialogContent>
                </Dialog>
              </Fragment>
            ))
          ) : (
            <Typography variant="subtitle2">N/A</Typography>
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
