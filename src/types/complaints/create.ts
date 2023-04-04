export interface IFormInput {
  title: string;
  content: string;
  images: { file: File; id: string }[];
  location?: string;
  licensePlate?: string;
  featuredImage: string;
}
