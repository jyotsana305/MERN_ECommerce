import app from "./app.js";
import dotenv from "dotenv";
import {v2 as cloudinary} from 'cloudinary';
import connectMongoDatabase from "./config/db.js";

dotenv.config({ path: "./backend/.env" });

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