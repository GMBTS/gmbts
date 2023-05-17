import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import { FormControlLabel, IconButton, Switch, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Head from 'next/head';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import * as uuid from 'uuid';

import { useCreateComplaint } from '@/client/components/file-upload/hooks/useCreateComplaint';
import { CreateComplaintFormData, CreateComplaintPayload } from '@/types/complaints/create';
import { IMAGES_MIME_TYPE, MAX_FILE_UPLOAD_COUNT, MAX_UPLOAD_FILE_SIZE } from '@/utils/constants';

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

const NewPost = () => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    unregister,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateComplaintFormData>();
  const { mutateAsync: createComplaint, isError, isLoading, data } = useCreateComplaint();
  const [success, setSuccess] = useState(false);
  const [location, setLocation] = useState<GeolocationCoordinates>();
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  register('images', { required: true, value: [] });
  register('location');
  register('featuredImage');

  useEffect(() => () => unregister('images'), [unregister]);

  const images = watch('images');
  const featuredImage = watch('featuredImage');

  const onDrop = useCallback(
    (droppedFiles: File[]) => {
      if (images.length + droppedFiles.length > MAX_FILE_UPLOAD_COUNT) return;

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

  const onSubmit: SubmitHandler<CreateComplaintFormData> = async (data) => {
    setSuccess(false);
    await createComplaint(data);
    reset();
    setSuccess(true);
  };

  const onSuccessLocation = useCallback(
    (pos: GeolocationPosition) => {
      const crd = pos.coords;

      // console.log('Your current position is:');
      // console.log(`Latitude : ${crd.latitude}`);
      // console.log(`Longitude: ${crd.longitude}`);
      // console.log(`More or less ${crd.accuracy} meters.`);

      setLocation(crd);

      setValue('location', JSON.stringify(crd));
    },
    [setValue],
  );

  function error(err: GeolocationPositionError) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

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
    if (typeof window !== 'undefined') {
      navigator?.geolocation.getCurrentPosition(onSuccessLocation, error, options);
    }
  }, [onSuccessLocation]);

  useEffect(() => {
    return () => previewUrls.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>GMBTS | Complaints - Create</title>
      </Head>
      <div style={{ height: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <Typography variant="h4">Create a complaint</Typography>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '75%',
              maxWidth: '600px',
              justifyContent: 'center',
              margin: 'auto',
              marginTop: '10%',
              paddingBottom: '10%',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <TextField
                {...register('title', { required: 'This field is required' })}
                label="Title"
                variant="standard"
                error={!!errors.title}
                helperText={errors?.title?.message}
                style={{ marginBottom: 24 }}
              />
              <TextField
                {...register('licensePlate', { required: 'This field is required' })}
                variant="standard"
                label="License Plate"
                type="number"
                error={!!errors.licensePlate}
                helperText={errors?.licensePlate?.message}
                style={{ marginBottom: 24 }}
                InputProps={{
                  placeholder: '77-777-77',
                }}
              />
              <TextField
                {...register('content', { required: 'This field is required' })}
                type="text"
                variant="standard"
                label="Description"
                multiline
                rows={2}
                error={!!errors.content}
                helperText={errors?.content?.message}
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
                    control={control}
                  />
                }
                label="Stay anonymous"
              />

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
                          <IconButton
                            onClick={() => updateFeaturedImage(index)}
                            aria-label="delete"
                            style={{ opacity: 1 }}
                          >
                            <StarIcon
                              style={{
                                color:
                                  featuredImage === image.id || (!featuredImage && index === 0) ? 'yellow' : 'gray',
                              }}
                            />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <div {...getRootProps({ className: 'my-dropzone', style: { cursor: 'pointer', margin: '24px 0' } })}>
                <input {...getInputProps({ id: 'images' })} />
                Drag n drop here
              </div>
            </div>
          </div>
          <div
            id="footer"
            style={{
              width: '100%',
              backgroundColor: 'gray',
              position: 'sticky',
              bottom: 0,
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row-reverse',
              alignItems: 'center',
              height: 56,
              borderRadius: 4,
              padding: '8px 16px',
            }}
          >
            <div>
              <Button disabled={isLoading} variant="contained" type="submit">
                Submit
              </Button>
            </div>

            {isLoading && <div>Uploading</div>}

            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '20px' }}>
              {success && <Typography color="success">Success!</Typography>}
              {isError && <div>Error</div>}
            </div>

            <Button component={Link} variant="contained" color="secondary" href="/feed">
              {`< Back to feed`}
            </Button>
          </div>
        </form>
        <div />
      </div>
    </>
  );
};

export default NewPost;
