/* eslint-disable react-hooks/exhaustive-deps */
import FormProvider, { RHFAutocomplete, RHFTextField, RHFUpload } from '@components/hook-form';
import RHFEditor from '@components/hook-form/RHFEditor';
import { useSnackbar } from '@components/snackbar';
import UploadBox from '@components/upload/CustomUpload/UploadBox';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import { postResourcesCreateAsync, updateResourcesAsync } from '@redux/services/resourcesService';
import { PATH_DASHBOARD } from '@routes/paths';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { getCategoryAsync } from '@redux/services/categoryService';

ResourcesForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentResources: PropTypes.object,
};

export default function ResourcesForm({ isEdit = false, isView = false, currentResources }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const [staffRole, setStaffRole] = useState(currentResources?.role || '');
  //  const {isLoading} = useSelector((store)=> store?.resources);
  const { AllCategory } = useSelector((store) => store?.category);
  const validateImageFileType = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    return allowedTypes.includes(file.type);
  };
  const UserSchema = Yup.object().shape({
    thumbnail: !isEdit
      ? Yup.mixed().test('fileOrURL', 'Select a valid Image (max 1MB)', (value) => {
          if (isEdit) {
            // If in edit mode, check if the value is a valid URL (HTTPS link) or a valid image
            return (
              Yup.string()
                .url()
                .matches(/^https:/)
                .isValidSync(value[0]) ||
              (value &&
                value[0] instanceof File &&
                validateImageFileType(value[0]) &&
                value[0].size <= 1048576)
            );
          }
          return (
            value &&
            value[0] instanceof File &&
            validateImageFileType(value[0]) &&
            value[0].size <= 1048576
            // (typeof value[0] === 'string' && validateImageURL(value[0]))
          );
        })
      : '',
    title: Yup.string().required('Title is required'),
    category: Yup.object().required('Category is required'),
    type: Yup.string().required('Type is required'),
    resourceLink:
      // eslint-disable-next-line no-nested-ternary
      staffRole === 'video'
        ? Yup.string().required('Video link is required')
        : staffRole === 'article'
        ? Yup.string().required('Article is required')
        : '',
    document:
      staffRole === 'pdf'
        ? Yup.mixed().test('fileOrURL', 'Select a PDF (max 100MB)', (value) => {
            if (isEdit) {
              // If in edit mode, check if the value is a valid URL (HTTPS link) or a valid PDF
              return (
                Yup.string()
                  .url()
                  .matches(/^https:/)
                  .isValidSync(value[0]) ||
                (value && value[0] instanceof File && value[0].type === 'application/pdf')
              );
            }
            // If not in edit mode, check if a file is uploaded and if it's a PDF
            return value && value[0] instanceof File && value[0].type === 'application/pdf';
          })
        : '',
    // resourceLink: staffRole === 'article' ? Yup.string() : '',
    // editor:staffRole === 'Article' ?  Yup.string() : '',
  });

  const defaultValues = useMemo(
    () => ({
      thumbnail: currentResources?.thumbnail || [],
      title: currentResources?.title || '',
      description: currentResources?.description || '',
      category: currentResources?.category || null,
      type: currentResources?.type || null,
      document: currentResources?.document || '',
      resourceLink: currentResources?.resourceLink || '',
      editor: currentResources?.editor || '',
    }),

    [currentResources]
  );

  const methods = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    getValues,
    formState: { isSubmitting, errors },
  } = methods;

  const values = getValues();
  const roleType = watch('type');

  useEffect(() => {
    setStaffRole(roleType);
  }, [roleType]);

  useEffect(() => {
    if ((isEdit && currentResources) || (isView && currentResources)) {
      reset(defaultValues);
      setImageFiles(currentResources?.thumbnail ? [{ preview: currentResources.thumbnail }] : []);
      setPdfFile(
        currentResources?.resourceLink ? [{ preview: currentResources.resourceLink }] : []
      );
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, isView, currentResources]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('thumbnail', data.thumbnail[0]);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category._id);
    formData.append('type', data.type);
    formData.append('document', data.document[0]);
    formData.append('resourceLink', data.resourceLink || data.editor);
    // formData.append('editor', data.editor);

    try {
      const response = await dispatch(
        isEdit
          ? updateResourcesAsync({ id: currentResources?._id, data: formData })
          : postResourcesCreateAsync(formData)
      );

      if (response?.payload?.data?.success) {
        enqueueSnackbar(
          isEdit ? 'Resources Update successfully!' : 'Resources Created successfully!'
        );
        navigate(PATH_DASHBOARD.resources.list);
        reset();
      }
    } catch (error) {
      enqueueSnackbar('Something went wrong!');
      console.error(error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState(' ');
  const handleDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });
    if (file) {
      setImageFiles([newFile]);
      setImagePreview(newFile.preview);
      setValue('thumbnail', [newFile]);
    }
    methods.trigger('thumbnail');
  });

  const [pdfFile, setPdfFile] = useState([]);
  const [pdfPreview, setPdfPreview] = useState(' ');

  const handlePdfUpload = useCallback((acceptedFiles) => {
    const pdf = acceptedFiles[0];
    const newPdf = Object.assign(pdf, {
      preview: URL.createObjectURL(pdf),
    });
    if (pdf) {
      setPdfFile([newPdf]);
      setPdfPreview(newPdf.preview);
      setValue('document', [newPdf]);
    }
    methods.trigger('document');
  }, []);

  useEffect(() => {
    if (currentResources?.thumbnail) {
      setImageFiles([currentResources.thumbnail]);
      setValue('image', [currentResources?.thumbnail]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentResources]);

  useEffect(() => {
    dispatch(getCategoryAsync());
  }, [dispatch]);
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Card sx={{ p: 3, width: '100%' }}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <Box>
              <UploadBox
                disabled={isView}
                height={58}
                name="thumbnail"
                label="Thumbnail (max 1MB)"
                accept={{
                  'image/*': [],
                }}
                onDrop={handleDrop}
                file={imageFiles[0]}
                error={
                  Boolean(errors.thumbnail) && (!values.thumbnail || values.thumbnail.length === 0)
                }
              />
              {errors.thumbnail && values.thumbnail && (
                <Typography color="error" variant="caption">
                  {errors.thumbnail.message}
                </Typography>
              )}
              <Typography
                variant="body2"
                style={{ fontSize: '0.75rem', color: 'rgba(255, 0, 0, 0.5)' }}
              >
                {' '}
                Recommended Image size 1920X1080p
              </Typography>
            </Box>
            <RHFTextField disabled={isView} name="title" label="Title" />
            {roleType !== 'pdf' ? (
              <RHFTextField disabled={isView} name="description" label="Description" />
            ) : (
              ''
            )}
            <RHFAutocomplete
              disabled={isView}
              name="category"
              label="Category"
              options={AllCategory}
              getOptionLabel={(option) =>
                option && option.category
                  ? option.category.replace(/\b\w/g, (char) => char.toUpperCase())
                  : ''
              }
              isOptionEqualToValue={(option, value) => option._id === value._id}
            />

            <RHFAutocomplete
              disabled={isView}
              name="type"
              label="Type"
              options={type}
              getOptionLabel={(option) => option.replace(/\b\w/g, (char) => char.toUpperCase())}
            />
          </Box>
          <Box marginTop={3}>
            {roleType === 'pdf' && (
              <Stack spacing={2}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Attachment
                </Typography>
                <RHFUpload
                  disabled={isView}
                  multiple
                  thumbnail
                  name="document"
                  label="Attachment"
                  maxSize={100 * 1024 * 1024}
                  onDrop={handlePdfUpload}
                  accept={{ 'application/pdf': [] }}
                  file={pdfFile[0]}
                />
              </Stack>
            )}
            {roleType === 'video' && (
              <RHFTextField disabled={isView} name="resourceLink" label="Youtube URL" />
            )}
            {roleType === 'article' && (
              <Stack>
                <RHFEditor disabled={isView} simple name="resourceLink" sx={{ height: 200 }} />
              </Stack>
            )}
          </Box>

          {isView ? (
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton onClick={handleBack} type="button" variant="contained">
                Back
              </LoadingButton>
            </Stack>
          ) : (
            <Stack gap="10px" justifyContent="flex-end" flexDirection="row" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create Resources' : 'Save Changes'}
              </LoadingButton>

              {isEdit && (
                <LoadingButton onClick={handleBack} type="button" variant="contained" color="error">
                  Cancel
                </LoadingButton>
              )}
            </Stack>
          )}
        </Card>
      </Grid>
    </FormProvider>
  );
}

const type = ['article', 'video', 'pdf'];
