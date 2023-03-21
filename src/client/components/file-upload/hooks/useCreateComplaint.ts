import axios, { AxiosRequestConfig } from 'axios';
import { useMutation } from 'react-query';
import { json } from 'stream/consumers';

import { IFormInput } from '@/pages/complaint/create';

const useCreateComplaint = () => {
  return useMutation(async (complaint: IFormInput) => {
    const formData = new FormData();

    complaint.images.forEach((image) => {
      formData.append(image.name, image);
    });

    formData.append('formData', JSON.stringify({ ...complaint, images: undefined }));

    const config: AxiosRequestConfig = {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (event.total) {
          console.log(`Current progress:`, Math.round((event.loaded * 100) / event.total));
        }
      },
    };

    const x = await axios.post('/api/complaint/create', formData, config);

    return x;
  });
};
export { useCreateComplaint };
