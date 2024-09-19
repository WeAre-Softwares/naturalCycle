import type { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

// Cloudinary devuelve una promesa, upload OK o upload Error
export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;
