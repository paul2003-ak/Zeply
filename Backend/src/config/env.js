import dotenv from 'dotenv';
dotenv.config();

export const ENV={
    PORT:process.env.PORT,
    MONGODB_URI:process.env.MONGO_URL,
    NODE_ENV:process.env.NODE_ENV,
    CLOUDINARY_CLOUD_NAME:process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET:process.env.CLOUDINARY_API_SECRET,
    ARCJET_API_KEY:process.env.ARCJET_KEY,
    ARCJET_ENV:process.env.ACRJET_ENV,
    CLERK_PUBLISHABLE_KEY:process.env.CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY:process.env.CLERK_SECRET_KEY,

};