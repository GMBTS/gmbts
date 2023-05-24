import { Complaint } from '@prisma/client';
import axios from 'axios';
import { useMutation } from 'react-query';

import { CreateComplaintFormData, CreateComplaintPayload } from '@/types/complaints/create';

type UrlsResponse = {
  posts: { fields: { key: string }; url: string }[];
  complaintId: string;
};

function useCreateUploadUrl() {
  return useMutation(async (complaint: CreateComplaintFormData) => {
    const res = await axios.post<UrlsResponse>('/api/upload-url', {
      files: complaint.images.map(({ id }) => id),
    });

    return res.data;
  });
}

const uploadFiles = async (files: { file: File; id: string }[], posts: { fields: any; url: string }[]) => {
  return Promise.all(
    files.map(async ({ file, id }) => {
      const formData = new FormData();
      const post = posts.find((p) => p.fields.key.includes(id));

      if (!post) {
        throw new Error('No post found');
      }

      Object.entries({ ...post.fields, file }).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      return axios.post(post.url, formData);
    }),
  );
};

const useCreateComplaint = () => {
  const { mutateAsync: createUploadUrls } = useCreateUploadUrl();

  return useMutation(async (complaint: CreateComplaintFormData): Promise<Complaint> => {
    const { posts, complaintId } = await createUploadUrls(complaint);
    await uploadFiles(complaint.images, posts);

    const payload: CreateComplaintPayload = {
      ...complaint,
      complaintId,
      imageKeys: posts.map(({ fields }) => fields.key),
      location: complaint.location
        ? {
            latitude: complaint.location.latitude,
            longitude: complaint.location.longitude,
            accuracy: complaint.location.accuracy,
          }
        : undefined,
      asamakhta: complaint.asamakhta,
    };

    const returnedValue = await axios.post<Complaint>('/api/complaint/create', payload);

    return returnedValue.data;
  });
};

export { useCreateComplaint };
