import PropTypes from 'prop-types';
import { useState } from 'react';
import Grid from '@mui/material/Grid';
// @mui
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
  Typography,
  Link,
  Dialog,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router';
// components
import ConfirmDialog from '@components/confirm-dialog';
import Iconify from '@components/iconify';
import Label from '@components/label';
import { getDietPlanNotesAsync } from '@redux/services';
import MenuPopover from '@components/menu-popover';
import DietPlanNotes from './DietPlanNotes';
// import ViewDietPlanNotes from './ViewDietPlanNotes';
import ViewDietPlanNotes from './ViewDietPlanNotes';

// ----------------------------------------------------------------------

DietPlanTableRow.propTypes = {
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

export default function DietPlanTableRow({
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
  const { userId, planId, phase, pdfReport, createdBy } = row;
  const { page, limit } = query;
  const { getDietPlanNotes } = useSelector((store) => store?.dietPlan);
  const [noteDiet, setNoteDiet] = useState('');
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

  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => {
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };
  const [openView, setOpenView] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();

  const handleOpenView = (e) => {
      setOpenView(true);
  };

  const handleCloseView = () => {
    setOpenView(false);
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
          <Typography variant="subtitle2">{userId?.name}</Typography>
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          <Typography variant="subtitle2">{planId?.title}</Typography>
        </TableCell>
        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          <Typography variant="subtitle2">{phase}</Typography>
        </TableCell>
        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {pdfReport && pdfReport.length > 0 ? (
              // eslint-disable-next-line no-shadow
              pdfReport.map((pdf, index) => (
                <Link href={pdf} key={index}>
                  <Iconify icon="ic:round-cloud-download" />
                </Link>
              ))
            ) : (
              <Typography variant="subtitle2">N/A</Typography>
            )}
          </Box>
        </TableCell>
        <TableCell>
          <Grid xs={6} style={{ padding: '1px', marginRight: 10 }}>
            <Button variant="contained" onClick={() => handleOpenView()} type='button'>
              View
            </Button>
          </Grid>
        </TableCell>
        <TableCell align="left">
          <Label variant="soft" color="success" sx={{ textTransform: 'capitalize' }}>
            <Typography variant="subtitle2">{createdBy?.name}</Typography>
          </Label>
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
            handleOpenEdit();
          }}
          disabled={!modulePermit.edit}
        >
          <Iconify icon="eva:plus-circle-outline" />
          Add notes
        </MenuItem>
        <Dialog open={openEdit} onClose={handleCloseEdit}>
          <DietPlanNotes row={row} handleCloseEdit={handleCloseEdit} />
        </Dialog>

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
          <Button variant="contained" color="error" onClick={() => onDeleteRow(handleCloseConfirm)}>
            Delete
          </Button>
        }
      />

      <Dialog fullWidth maxWidth="lg" open={openView} onClose={handleCloseView}>
        <ViewDietPlanNotes row={row} id={row._id} handleCloseView={handleCloseView} />
      </Dialog>

    </>
  );
}
