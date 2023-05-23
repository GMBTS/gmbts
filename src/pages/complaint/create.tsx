import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import { Box, FormControlLabel, IconButton, Switch, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller, FormProvider, SubmitHandler, useForm, useFormContext } from 'react-hook-form';
import * as uuid from 'uuid';

import FormLocation from '@/client/components/complaint/create/FormLocation';
import { useCreateComplaint } from '@/client/components/file-upload/hooks/useCreateComplaint';
import { CreateComplaintFormData, FormGeolocationCoordinates } from '@/types/complaints/create';
import { IMAGES_MIME_TYPE, MAX_FILE_UPLOAD_COUNT, MAX_UPLOAD_FILE_SIZE } from '@/utils/constants';

const FormFileUpload: React.FC = () => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]); //todo move this to form state?
  const { register, unregister, setValue, watch } = useFormContext<CreateComplaintFormData>();

  register('featuredImage');
  register('images', { required: true, value: [] });

  useEffect(() => () => unregister('images'), [unregister]);

  const featuredImage = watch('featuredImage');
  const images = watch('images');

  const onDrop = useCallback(
    (droppedFiles: File[]) => {
      if (images.length + droppedFiles.length > MAX_FILE_UPLOAD_COUNT) return;

      console.log('images', droppedFiles, images);
      setValue('images', [...images, ...droppedFiles.map((file) => ({ file, id: uuid.v4() }))]);
      setPreviewUrls([...previewUrls, ...droppedFiles.map((file) => URL.createObjectURL(file))]);
    },
    [images, setValue, previewUrls],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    accept: { [IMAGES_MIME_TYPE]: [] },
    maxSize: MAX_UPLOAD_FILE_SIZE,
    useFsAccessApi: false,
    maxFiles: MAX_FILE_UPLOAD_COUNT,
  });

  function removeImage(index: number): void {
    if (images[index] === undefined) return;

    const newImages = [...images];
    newImages.splice(index, 1);
    setValue('images', newImages);

    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(index, 1);

    setPreviewUrls(newPreviewUrls);
  }

  function updateFeaturedImage(index: number): void {
    if (images[index] === undefined) return;

    setValue('featuredImage', images[index].id);
  }

  useEffect(() => {
    return () => previewUrls.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div>FormFileUpload</div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {images &&
          images.length > 0 &&
          images.map((image, index) => (
            <div key={`${image.id}`} style={{ display: 'flex', alignItems: 'center', margin: '16px 0' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={previewUrls[index]}
                  style={{
                    maxWidth: '100%',
                    maxHeight: 450,
                    objectFit: 'contain',
                    borderRadius: '5%',
                  }}
                />

                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    marginRight: -20,
                    marginTop: -20,
                    backgroundColor: 'coral',
                    borderRadius: '50%',
                    opacity: 0.9,
                  }}
                >
                  <IconButton onClick={() => removeImage(index)} aria-label="delete" style={{ opacity: 1 }}>
                    <DeleteIcon />
                  </IconButton>
                </div>

                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: '#cdc0c0',
                    borderRadius: '50%',
                    marginBottom: -20,
                    marginRight: -20,
                  }}
                >
                  <IconButton onClick={() => updateFeaturedImage(index)} aria-label="delete" style={{ opacity: 1 }}>
                    <StarIcon
                      style={{
                        color: featuredImage === image.id || (!featuredImage && index === 0) ? 'yellow' : 'gray',
                      }}
                    />
                  </IconButton>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div {...getRootProps({ className: 'my-dropzone', style: { cursor: 'pointer', margin: '16px 0' } })}>
        <input {...getInputProps({ id: 'images' })} />
        Drag 'n' drop here
        <Box marginTop={1}>OR</Box>
        <Button type="button" variant="contained" color="primary" sx={{ borderRadius: 0, marginTop: 1 }}>
          Browse
        </Button>
      </div>
    </div>
  );
};

const CreateComplaintForm = () => {
  const methods = useForm<CreateComplaintFormData>();
  const { mutateAsync: createComplaint, isError, isLoading } = useCreateComplaint();
  const [success, setSuccess] = useState(false);

  const onSubmit: SubmitHandler<CreateComplaintFormData> = async (data) => {
    setSuccess(false);
    await createComplaint(data);
    methods.reset();
    setSuccess(true);
  };

  const setLocation = useCallback(
    (coords: FormGeolocationCoordinates) => {
      methods.setValue('location', coords);
    },
    [methods],
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ textAlign: 'center', marginTop: 36 }}>
        <Typography variant="h4">Create a complaint</Typography>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} style={{ flex: 1, display: 'grid' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '75%',
              maxWidth: '600px',
              justifyContent: 'center',
              margin: '0 auto',
              marginBottom: '1%',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <TextField
                {...methods.register('title', { required: 'This field is required' })}
                label="Title"
                variant="standard"
                error={!!methods.formState.errors.title}
                helperText={methods.formState.errors?.title?.message}
                style={{ marginBottom: 24 }}
              />
              <TextField
                {...methods.register('licensePlate', { required: 'This field is required' })}
                variant="standard"
                label="License Plate"
                type="number"
                error={!!methods.formState.errors.licensePlate}
                helperText={methods.formState.errors?.licensePlate?.message}
                style={{ marginBottom: 24 }}
                InputProps={{
                  placeholder: '77-777-77',
                }}
              />
              <TextField
                {...methods.register('content', { required: 'This field is required' })}
                type="text"
                variant="standard"
                label="Description"
                multiline
                rows={2}
                error={!!methods.formState.errors.content}
                helperText={methods.formState.errors?.content?.message}
                style={{ marginBottom: 24 }}
              />

              <FormControlLabel
                control={
                  <Controller
                    render={({ field }) => {
                      return <Switch {...field} />;
                    }}
                    name="isAnonymous"
                    defaultValue={false}
                    control={methods.control}
                  />
                }
                label="Stay anonymous"
              />

              <FormFileUpload />
            </div>
          </div>

          <FormLocation setLocation={setLocation} />
          <div
            id="footer"
            style={{
              width: '100%',
              backgroundColor: '#92bcea',
              position: 'sticky',
              bottom: 0,
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row-reverse',
              alignItems: 'center',
              height: 48,
              borderRadius: 4,
              padding: '8px 16px',
              alignSelf: 'end',
            }}
          >
            <div>
              <Button disabled={isLoading} variant="contained" type="submit">
                Submit
              </Button>
            </div>

            {isLoading && <div>Uploading</div>}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              {success && <Typography color="success">Success!</Typography>}
              {isError && <div>Error</div>}
            </div>

            <Button component={Link} variant="contained" color="secondary" href="/feed">
              {`< Back to feed`}
            </Button>
          </div>
        </form>
      </FormProvider>
      <div />
    </div>
  );
};

const CreateComplaintPage = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'unauthenticated') {
    return <p>Access Denied</p>;
  }

  return (
    <>
      <Head>
        <title>GMBTS | Complaints - Create</title>
      </Head>

      <div style={{ height: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column' }}>
        <CreateComplaintForm />
      </div>
    </>
  );
};

export default CreateComplaintPage;
