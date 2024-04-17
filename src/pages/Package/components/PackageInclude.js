import FormProvider, { RHFTextField } from '@components/hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, Grid, IconButton, MenuItem, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import Iconify from '@components/iconify/Iconify';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ConfirmDialog from '@components/confirm-dialog/ConfirmDialog';
import MenuPopover from '@components/menu-popover/MenuPopover';

PackageIncludes.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentBook: PropTypes.object,
  setBookPriceArray: PropTypes.array,
  bookPriceArray: PropTypes.array,
};

export default function PackageIncludes({
  isEdit = false,
  isView = false,
  currentBook,
  setBookPriceArray,
  bookPriceArray,
}) {
  const [openPopover, setOpenPopover] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [fillform, setFillForm] = useState([]);
  const [formEdit, setFormEdit] = useState(false);
  const [tabelId, setTableId] = useState('');

  useEffect(() => {
    // Update bookPriceArray when currentBook changes
    setBookPriceArray(currentBook || []);
  }, [currentBook, setBookPriceArray]);

  const handleOpenPopover = (event, index) => {
    setOpenPopover(event.currentTarget);
    setTableId(index);
    setFillForm(bookPriceArray[index]);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleEdit = (index) => {
    const selectedData = bookPriceArray[index];
    setFillForm(selectedData);
    setTableId(index);
    setFormEdit(true);
  };

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required.'),
    value: '',
  });

  const defaultValues = useMemo(
    () => ({
      name: fillform?.name || '',
      value: fillform?.value || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formEdit, fillform]
  );
  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const { reset, watch, handleSubmit } = methods;
  const values = watch();

  useEffect(() => {
    if (formEdit && fillform) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line
  }, [formEdit, fillform]);

  // const onSubmit = async (data) => {

  //   const newData = {
  //     ...data,
  //     value: data?.value,
  //     name: data?.name,
  //   };
  //   setBookPriceArray([...bookPriceArray, newData]);
  //   reset();
  //   setFillForm();
  // };

  const onSubmit = async (data) => {
    const newData = {
      value: data?.value,
      name: data?.name,
    };

    if (formEdit) {
      // If in edit mode, update the existing object in the array
      const updatedArray = bookPriceArray.map((item, index) => (index === tabelId ? data : item));
      setBookPriceArray(updatedArray);
      setFormEdit(false);
    } else {
      // If not in edit mode, add a new object to the array
      setBookPriceArray([...bookPriceArray, newData]);
      setFormEdit(false);
    }

    reset();
    setFillForm();
  };

  const removeData = () => {
    const updatedArray = bookPriceArray.filter((data, index) => index !== tabelId);
    setBookPriceArray(updatedArray);
    handleCloseConfirm();
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3, mt: 3 }}>
              <Typography variant="h5">Package Includes</Typography>
              <Box
                rowGap={3}
                columnGap={2}
                mt={4}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                }}
              >
                <RHFTextField disabled={isView} name="name" focused label="Name" />

                <RHFTextField disabled={isView} name="value" focused label="Value" />
              </Box>

              <Box sx={{ textAlign: 'end', mt: 2 }}>
                <Button
                  disabled={isView}
                  variant="contained"
                  type="submit"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                >
                  Add
                </Button>
              </Box>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650, mt: 3 }} aria-label="caption table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Package Name</TableCell>
                      <TableCell align="left">Package Value</TableCell>
                      <TableCell align="left">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bookPriceArray?.map((row, index) => (
                      <>
                        <TableRow key={row?.name}>
                          <TableCell align="left">{row.name}</TableCell>
                          <TableCell align="left">{row.value}</TableCell>
                          <TableCell align="left">
                            <IconButton
                              disabled={isView}
                              color={openPopover ? 'inherit' : 'default'}
                              onClick={(e) => {
                                handleOpenPopover(e);
                                setTableId(index);
                                // setFillForm(row)
                              }}
                            >
                              <Iconify icon="eva:more-vertical-fill" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      </>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem onClick={() => handleEdit(tabelId)}>
          <Iconify icon="material-symbols:edit" />
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
          <Button variant="contained" color="error" onClick={() => removeData(tabelId)}>
            Delete
          </Button>
        }
      />
    </>
  );
}
