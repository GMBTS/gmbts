import axios from 'axios';
import { useMutation } from 'react-query';

export const useDeleteComplaint = () => {
  const mutation = useMutation(({ complaintId }: { complaintId: string }) => {
    return axios.delete('/api/complaint/delete', { params: { complaintId } });
  });

  return mutation;
};
