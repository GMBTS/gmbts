export type CreateComplaintFormData = {
  title: string;
  content: string;
  images: { file: File; id: string }[];
  location?: string;
  licensePlate?: string;
  featuredImage: string;
  isAnonymous: boolean;
};
export type CreateComplaintPayload = Omit<CreateComplaintFormData, 'images'> & {
  complaintId: string;
  imageKeys: string[];
};
