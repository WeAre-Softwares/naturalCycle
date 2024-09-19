import { Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  DeleteApiResponse,
  type UploadApiResponse,
} from 'cloudinary';
import type { CloudinaryResponse } from './types/cloudinary-response.type';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  // Method
  uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder }, // Especificamos la carpeta
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('No result from Cloudinary'));
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async getFile(publicId: string, folder: string): Promise<UploadApiResponse> {
    try {
      const file = await cloudinary.api.resource(publicId, {
        type: 'upload',
        prefix: folder,
      });
      return file;
    } catch (error) {
      return null;
    }
  }

  async deleteImage(publicId: string): Promise<DeleteApiResponse> {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  }
}
