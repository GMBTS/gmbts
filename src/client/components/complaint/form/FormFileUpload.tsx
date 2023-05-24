import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import { Box, Button, IconButton } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import * as uuid from 'uuid';

import { CreateComplaintFormData } from '@/types/complaints/create';
import { IMAGES_MIME_TYPE, MAX_FILE_UPLOAD_COUNT, MAX_UPLOAD_FILE_SIZE } from '@/utils/constants';

const FormFileUpload: React.FC = () => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]); //todo move this to form state? this wont reset on form reset
  const { register, unregister, setValue, watch } = useFormContext<CreateComplaintFormData>();

  register('featuredImage');
  register('images', { required: true, value: [] });

  useEffect(() => () => unregister('images'), [unregister]);

  const featuredImage = watch('featuredImage');
  const images = watch('images');

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

export default FormFileUpload;
