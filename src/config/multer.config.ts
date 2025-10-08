import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

export const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: 'nestjs_uploads',
    resource_type: 'image',
    public_id: file.originalname.split('.')[0],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  }),
});

export const upload = multer({ storage });
