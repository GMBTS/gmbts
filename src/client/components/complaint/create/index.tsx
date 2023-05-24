import { Button, FormControlLabel, Switch, TextField, Typography } from '@mui/material';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import { CreateComplaintFormData, FormGeolocationCoordinates } from '@/types/complaints/create';

import { useCreateComplaint } from '../../file-upload/hooks/useCreateComplaint';
import FormFileUpload from '../form/FormFileUpload';
import FormLocation from '../form/FormLocation';

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

              <TextField
                {...methods.register('asamakhta')}
                type="text"
                variant="standard"
                label="אסמכתאת עיריה"
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

export default CreateComplaintForm;
