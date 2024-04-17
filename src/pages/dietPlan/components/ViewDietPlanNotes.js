/* eslint-disable react-hooks/exhaustive-deps */
import {
  DialogActions,
  DialogContent,
  TableContainer,
  Table,
  Card,
  TableBody,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDietPlanNotesAsync } from '@redux/services';
import Scrollbar from '@components/scrollbar';
import { TableHeadCustom, TableNoData, useTable } from '@components/table';
import ViewDietPlanTableRow from './ViewDietPlanTableRow';

ViewDietPlanNotes.propTypes = {
  row: PropTypes.object,
  handleCloseView: PropTypes.func,
  id: PropTypes.object,
};

const TABLE_HEAD = [
  { id: 'sr. no', label: 'Sr No', align: 'left' },
  { id: 'notes', label: 'Notes', align: 'left' },
  { id: 'date', label: 'Date', align: 'left' },
];

export default function ViewDietPlanNotes({ row, id, handleCloseView }) {
  const { dense, order, orderBy, selected } = useTable();
  const dispatch = useDispatch();
  const { getDietPlanNotes, isLoad } = useSelector((store) => store?.dietPlan);
  useEffect(() => {
    dispatch(getDietPlanNotesAsync(id));
  }, [id]);

  return (
    <>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ marginRight: 'auto' }}>
          {row?.userId?.name} Notes
        </div>
        <div style={{ marginLeft: 'auto' }}>
          {row?.planId?.title}
        </div>
      </DialogTitle>
      <DialogContent sx={{ height: '350px' }}>
        <Card sx={{ height: '100%' }}>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={getDietPlanNotes?.length}
                  numSelected={selected.length}
                />
                <TableBody>
                  {isLoad ||
                    getDietPlanNotes?.map((data, index) => (
                      <ViewDietPlanTableRow
                        index={index}
                        key={data._id}
                        row={data}
                      />
                    ))}
                  <TableNoData isNotFound={getDietPlanNotes?.length} isLoading={isLoad} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        </Card>
      </DialogContent>
      <DialogActions>
        <LoadingButton type="submit" variant="contained" onClick={handleCloseView}>
          Close
        </LoadingButton>
      </DialogActions>
    </>
  );
}
