//

import dotenv from "dotenv";


dotenv.config({path: "./variable.env"});

export const VERSION = process.env["npm_package_version"] || "?";
export const PORT = process.env["PORT"] || 8050;
export const MONGO_URI = process.env["DB_URI"] || "mongodb://dummy";
export const COOKIE_SECRET = process.env["COOKIE_SECRET"] || "cookie-zpdic";
export const JWT_SECRET = process.env["JWT_SECRET"] || "jwt-secret";
export const SENDGRID_KEY = process.env["SENDGRID_KEY"] || "dummy";
export const REDIS_URI = process.env["REDIS_URI"] || "redis://dummy";
export const RECAPTCHA_SECRET = process.env["RECAPTCHA_SECRET"] || "dummy";
export const AWS_KEY = process.env["AWS_KEY"] || "dummy";
export const AWS_SECRET = process.env["AWS_SECRET"] || "dummy";
export const AWS_REGION = process.env["AWS_REGION"] || "ap-northeast-1";
export const AWS_STORAGE_BUCKET = process.env["AWS_STORAGE_BUCKET"] || "dummy";