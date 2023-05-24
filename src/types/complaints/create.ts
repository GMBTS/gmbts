export type FormGeolocationCoordinates = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

export type CreateComplaintFormData = {
  title: string;
  content: string;
  images: { file: File; id: string }[];
  location?: FormGeolocationCoordinates;
  licensePlate?: string;
  featuredImage: string;
  isAnonymous: boolean;
  asamakhta?: string;
};
export type CreateComplaintPayload = Omit<CreateComplaintFormData, 'images'> & {
  complaintId: string;
  imageKeys: string[];
};
