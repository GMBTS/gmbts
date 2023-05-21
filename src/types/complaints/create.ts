export type CreateComplaintFormData = {
  title: string;
  content: string;
  images: { file: File; id: string }[];
  location?: {
    latitude: GeolocationCoordinates['latitude'];
    longitude: GeolocationCoordinates['longitude'];
    accuracy: GeolocationCoordinates['accuracy'];
  };
  licensePlate?: string;
  featuredImage: string;
  isAnonymous: boolean;
};
export type CreateComplaintPayload = Omit<CreateComplaintFormData, 'images'> & {
  complaintId: string;
  imageKeys: string[];
};
