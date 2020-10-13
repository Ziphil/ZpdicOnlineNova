//

import dotenv from "dotenv";


dotenv.config({path: "./variable.env"});

export const PORT = process.env["PORT"] || 8050;
export const MONGO_URI = process.env["DB_URI"] || "mongodb://dummy";
export const COOKIE_SECRET = process.env["COOKIE_SECRET"] || "cookie-zpdic";
export const JWT_SECRET = process.env["JWT_SECRET"] || "jwt-secret";
export const SENDGRID_KEY = process.env["SENDGRID_KEY"] || "dummy";
export const RECAPTCHA_SECRET = process.env["RECAPTCHA_SECRET"] || "dummy";