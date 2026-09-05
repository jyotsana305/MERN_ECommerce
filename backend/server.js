import app from "./app.js";
import dotenv from "dotenv";
import {v2 as cloudinary} from 'cloudinary';
import connectMongoDatabase from "./config/db.js";
import { fileURLToPath } from 'url';
import path from 'path';

// Resolve .env relative to this file's own location (backend/) rather than
// the process's working directory, so this works whether the app is started
// from the project root or from inside backend/ (e.g. via backend's own
// package.json scripts).
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

connectMongoDatabase();
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})

process.on('uncaughtException', (err) => {
    console.log(`Error:${err.message}`);
    console.log(`Server is shutting down due to uncaught exception`);
    process.exit(1);
});

const port = process.env.PORT || 3000;

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy'
    });
});

const server = app.listen(port, () => {
    console.log(`Server is running on PORT ${port}`);
});

process.on('unhandledRejection', (err) => {
    console.log(`Error:${err.message}`);
    console.log(`Server is shutting down due to unhandled promise rejection`);
    server.close(() => {
        process.exit(1);
    });
});