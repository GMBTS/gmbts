import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { SubmitHandler, useForm } from 'react-hook-form';
import { QueryClient, QueryClientProvider } from 'react-query';

import { useCreateComplaint } from '@/client/components/file-upload/hooks/useCreateComplaint';
export const MAX_UPLOAD_FILE_SIZE = 10 * 1024 * 1024;

const queryClient = new QueryClient();
export interface IFormInput {
  title: string;
  content: string;
  images: File[];
  location?: string;
}

const X = () => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* // move this to _app */}
      <NewPost />
    </QueryClientProvider>
  );
};

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

const NewPost = () => {
  const { register, handleSubmit, setValue, getValues, unregister, reset } = useForm<IFormInput>();
  const { mutateAsync: createComplaint, isError, isLoading, data } = useCreateComplaint();
  const [success, setSuccess] = useState(false);
  const [location, setLocation] = useState<GeolocationCoordinates>();

  register('images', { required: true, value: [] });
  register('location');

  useEffect(() => () => unregister('images'), [unregister]);

  const images = getValues('images');

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
    accept: { 'image/*': [] },
    maxSize: MAX_UPLOAD_FILE_SIZE,
    useFsAccessApi: false,
    maxFiles: 5,
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setSuccess(false);
    const x = await createComplaint(data);
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      navigator?.geolocation.getCurrentPosition(onSuccessLocation, error, options);
    }
  }, [onSuccessLocation]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '200px',
          justifyContent: 'center',
          margin: 'auto',
          marginTop: '30%',

          paddingBottom: '10%',
        }}
      >
        <input {...register('title', { required: true, maxLength: 20 })} style={{ margin: '8px' }} />
        <input {...register('content')} style={{ margin: '8px' }} type="text" />

        <div {...getRootProps({ className: 'my-dropzone', style: { cursor: 'pointer', margin: '10px 0' } })}>
          <input {...getInputProps({ id: 'images' })} />
          Drag n drop here
        </div>
        {images && images.length > 0 && images.map((image) => <div>{image.name}</div>)}

        <input disabled={isLoading} type="submit" style={{ margin: '50px 0', padding: '5px 8px' }} />
        {isLoading && <div>Uploading</div>}
      </form>
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '20px' }}>
        {success && <div>Success</div>}
        {isError && <div>Error</div>}
        {location && <div>has location</div>}
      </div>

      <Link href="/feed">Back to feed</Link>
    </div>
  );
};

export default X;
