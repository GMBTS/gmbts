import axios, { AxiosRequestConfig } from 'axios';
import { useMutation } from 'react-query';

import { IFormInput } from '@/types/complaints/create';

const useCreateComplaint = () => {
  return useMutation(async (complaint: IFormInput) => {
    const formData = new FormData();

    complaint.images.forEach(({ file: image, id }) => {
      formData.append(id, image);
    });

    formData.append('formData', JSON.stringify({ ...complaint, images: undefined }));

    const config: AxiosRequestConfig = {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (event.total) {
          // console.log(`Current progress:`, Math.round((event.loaded * 100) / event.total));
        }
      },
    };

    return axios.post('/api/complaint/create', formData, config);
  });
};
export { useCreateComplaint };
