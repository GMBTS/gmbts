import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { SubmitHandler, useForm } from 'react-hook-form';

import { useCreateComplaint } from '@/client/components/file-upload/hooks/useCreateComplaint';
import { IFormInput } from '@/types/complaints/create';
import { IMAGES_MIME_TYPE, MAX_FILE_UPLOAD_COUNT, MAX_UPLOAD_FILE_SIZE } from '@/utils/constants';

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

const NewPost = () => {
  const {
    register,
    handleSubmit,
    setValue,
    unregister,
    reset,
    watch,
    formState: { errors },
  } = useForm<IFormInput>();
  const { mutateAsync: createComplaint, isError, isLoading, data } = useCreateComplaint();
  const [success, setSuccess] = useState(false);
  const [location, setLocation] = useState<GeolocationCoordinates>();

  register('images', { required: true, value: [] });
  register('location');

  useEffect(() => () => unregister('images'), [unregister]);

  const images = watch('images');

  const onDrop = useCallback(
    (droppedFiles: File[]) => {
      if (images.length + droppedFiles.length > 5) return;

      setValue('images', [...images, ...droppedFiles]);
    },
    [images, setValue],
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    accept: { [IMAGES_MIME_TYPE]: [] },
    maxSize: MAX_UPLOAD_FILE_SIZE,
    useFsAccessApi: false,
    maxFiles: MAX_FILE_UPLOAD_COUNT,
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setSuccess(false);
    await createComplaint(data);
    reset();
    setSuccess(true);
  };

  const onSuccessLocation = useCallback(
    (pos: GeolocationPosition) => {
      const crd = pos.coords;

      console.log('Your current position is:');
      console.log(`Latitude : ${crd.latitude}`);
      console.log(`Longitude: ${crd.longitude}`);
      console.log(`More or less ${crd.accuracy} meters.`);

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
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      navigator?.geolocation.getCurrentPosition(onSuccessLocation, error, options);
    }
  }, [onSuccessLocation]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ textAlign: 'center', marginTop: 36 }}>
        <Typography variant="h4">Create a complaint</Typography>
      </div>

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
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            {...register('title', { required: true, maxLength: 20 })}
            label="Title"
            variant="standard"
            error={!!errors.title}
            helperText={errors?.title?.message}
          />
          <TextField
            {...register('licensePlate')}
            type="text"
            variant="standard"
            label="License Plate"
            error={!!errors.licensePlate}
            helperText={errors?.licensePlate?.message}
          />
          <TextField
            {...register('content')}
            type="text"
            variant="standard"
            label="Description"
            multiline
            rows={2}
            error={!!errors.content}
            helperText={errors?.content?.message}
          />

          <div {...getRootProps({ className: 'my-dropzone', style: { cursor: 'pointer', margin: '10px 0' } })}>
            <input {...getInputProps({ id: 'images' })} />
            Drag n drop here
          </div>

          {images &&
            images.length > 0 &&
            images.map((image, index) => (
              <div key={`${image.name}`} style={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={() => removeImage(index)} aria-label="delete">
                  <DeleteIcon />
                </IconButton>
                <Typography noWrap variant="caption">
                  {image.name}
                </Typography>
              </div>
            ))}

          <Button disabled={isLoading} variant="contained" type="submit" style={{ marginTop: 16 }}>
            Submit
          </Button>

          {isLoading && <div>Uploading</div>}
        </form>

        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '20px' }}>
          {success && <div>Success</div>}
          {isError && <div>Error</div>}
        </div>

        <Button component={Link} variant="text" href="/feed" style={{ marginTop: 36 }}>
          {`< Back to feed`}
        </Button>
      </div>
    </div>
  );
};

export default NewPost;
