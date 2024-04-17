import React, { useState, useEffect } from 'react';
import {
  Checkbox,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
  Box,
  Paper,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router';

import { Helmet } from 'react-helmet-async';
import _, { capitalize } from 'lodash';
import { LoadingButton } from '@mui/lab';
import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '@routes/paths';
import Label from '@components/label/Label';
import { useSnackbar } from '@components/snackbar';
import { getPermissionByIdAsync, getRouteListAsync, postPermissionAsync } from '@redux/services';
import { useDispatch, useSelector } from 'react-redux';
import { routesDummyData } from '../../../../utils/dummyRoutes';

const PermissionList = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [allCheck, setAllCheck] = useState(false);
  const [RoutesPermission, setRoutesPermission] = useState([]);
  const { routeData } = useSelector((store) => store?.route);
  const { isSubmitting, permissionById } = useSelector((store) => store?.permission);

  const methods = useForm({});
  const { reset } = methods;

  const handleAllCheck = (permission) => {
    const permissionall = _.map(RoutesPermission, (evv) => {
      if (evv.title === 'Dashboard') {
        return {
          ...evv,
          create: true,
          edit: true,
          view: true,
          delete: true,
        };
      }
      return {
        ...evv,
        create: permission,
        edit: permission,
        view: permission,
        delete: permission,
      };
    });

    setRoutesPermission(permissionall);
  };

  const handleCheckPermission = (row, string, condition) => {
    const indexNum = RoutesPermission.findIndex((item) => item._id === row._id);
    let updateRow;
    if (string === 'create') {
      updateRow = { ...row, create: condition };
    } else if (string === 'edit') {
      updateRow = { ...row, edit: condition };
    } else if (string === 'view') {
      updateRow = {
        ...row,
        view: condition,
      };
      if (string === 'view' && condition === false) {
        updateRow = {
          ...updateRow,
          create: false,
          edit: false,
          delete: false,
        };
      }
    } else if (string === 'delete') {
      updateRow = { ...row, delete: condition };
    }
    if (indexNum !== -1) {
      const stateInfo = [...RoutesPermission];
      stateInfo.splice(indexNum, 1, { ...stateInfo[indexNum], ...updateRow });

      setRoutesPermission(stateInfo);
    }
  };

  const onSubmit = async () => {
    try {
      const permissionInfo = RoutesPermission?.map((ev) => ({
        roleId: id,
        routeId: ev._id,
        create: ev.create,
        edit: ev.edit,
        delete: ev.delete,
        view: ev.view,
      }));
      
      const response = await dispatch(postPermissionAsync(permissionInfo));

      if (response?.payload?.success) {
        enqueueSnackbar('Assign permission successfully');
        navigate(PATH_DASHBOARD.role.list);
        reset();
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (routeData) {
      const mapRoute = _.map(routeData, (item) => {
        if (item.title === 'Dashboard') {
          return {
            ...item,
            create: true,
            edit: true,
            delete: true,
            view: true,
          };
        }
        return item;
      });
      setRoutesPermission(mapRoute);
    }
  }, [routeData]);

  useEffect(() => {
    if (permissionById.length > 0) {
      const updateroute = _.map(routeData, (evv) => {
        const filterinfo = _.find(permissionById, (evvv) => evvv.routeId._id === evv._id);
        if (filterinfo) {
          return {
            ...evv,
            create: filterinfo.create,
            edit: filterinfo.edit,
            view: filterinfo.view,
            delete: filterinfo.delete,
          };
        }
        return evv;
      });
      setRoutesPermission(updateroute);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionById]);

  useEffect(() => {
    if (permissionById.length > 0 && routeData.length > 0) {
      const permissionall = permissionById.filter(
        (ev) => ev.create === true && ev.view === true && ev.edit === true && ev.delete === true
      );
      if (permissionall.length === routeData.length) {
        setAllCheck(true);
      } else {
        setAllCheck(false);
      }
    }
  }, [permissionById, routeData]);

  // useEffect(() => {
  //   if (routeData) {
  //     setRoutesPermission(routeData);
  //   }
  // }, [routeData]);

  useEffect(() => {
    dispatch(getRouteListAsync()).then((ev) => {
      if (id) dispatch(getPermissionByIdAsync(id));
    });
    // dispatch(getPermissionByIdAsync({id}))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title>Permission </title>
      </Helmet>

      <Container>
        <CustomBreadcrumbs
          heading="Permission"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Role',
              href: PATH_DASHBOARD.role.list,
            },
            {
              name: 'Permission',
              href: '',
            },
          ]}
          action={
            <Stack alignItems="flex-end" sx={{ mt: 5 }}>
              <LoadingButton
                type="button"
                variant="contained"
                onClick={onSubmit}
                loading={isSubmitting}
              >
                Assign Permission
              </LoadingButton>
            </Stack>
          }
        />

        <Box>
          <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
            <Box sx={{ display: 'flex' }}>
              <Typography
                variant="h4"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '15px !important',
                  lineHeight: '30px !important',
                  fontWeight: '500 !important',
                }}
              >
                <Checkbox
                  sx={{
                    p: 0,
                    mr: 1,
                  }}
                  checked={allCheck}
                  onClick={(e) => {
                    setAllCheck(e.target.checked);
                    handleAllCheck(e.target.checked);
                  }}
                />{' '}
                Select All
              </Typography>
            </Box>

            <Table aria-label="customized table" sx={{ marginTop: '21px' }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      backgroundColor: '#F2F3F7 !important',
                      color: '#000000 !important',
                      fontWeight: 700,
                    }}
                  >
                    MODULE
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: '#F2F3F7 !important',
                      color: '#000000 !important',
                      fontWeight: 700,
                    }}
                    align="right"
                  >
                    VIEW
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: '#F2F3F7 !important',
                      color: '#000000 !important',
                      fontWeight: 700,
                    }}
                    align="right"
                  >
                    EDIT
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: '#F2F3F7 !important',
                      color: '#000000 !important',
                      fontWeight: 700,
                    }}
                    align="right"
                  >
                    CREATE
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: '#F2F3F7 !important',
                      color: '#000000 !important',
                      fontWeight: 700,
                    }}
                    align="right"
                  >
                    DELETE
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {RoutesPermission &&
                  RoutesPermission.length &&
                  RoutesPermission?.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row" sx={{ py: '12px !important' }}>
                        {capitalize(row?.title)}
                        {Boolean(row?.parent) && (
                          <Label
                            variant="soft"
                            color="success"
                            sx={{ textTransform: 'capitalize', ml: 2 }}
                          >
                            {row?.parent}
                          </Label>
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ py: '0px !important' }}>
                        <Checkbox
                          checked={row.view}
                          onChange={(e) => {
                            const permission = !row.view;
                            handleCheckPermission(row, 'view', permission);
                          }}
                          disabled={Boolean(row.title === 'Dashboard')}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ py: '0px !important' }}>
                        <Checkbox
                          checked={row.edit}
                          onChange={(e) => {
                            const permission = !row.edit;
                            handleCheckPermission(row, 'edit', permission);
                          }}
                          disabled={!row.view || Boolean(row.title === 'Dashboard')}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ py: '0px !important' }}>
                        <Checkbox
                          checked={row.create}
                          onChange={(e) => {
                            const permission = !row.create;
                            handleCheckPermission(row, 'create', permission);
                          }}
                          disabled={!row.view || Boolean(row.title === 'Dashboard')}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ py: '0px !important' }}>
                        <Checkbox
                          checked={row.delete}
                          onChange={(e) => {
                            const permission = !row.delete;
                            handleCheckPermission(row, 'delete', permission);
                          }}
                          disabled={!row.view || Boolean(row.title === 'Dashboard')}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </>
  );
};

export default PermissionList;
