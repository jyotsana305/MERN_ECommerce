import express from "express";
import productRoutes from "./routes/productRoutes.js";
import user from "./routes/userRoutes.js";
import order from "./routes/orderRoutes.js";
import errorHandleMiddleware from "./middleware/error.js";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json())
app.use(cookieParser())
app.use(fileUpload())
// Add this BEFORE your route declarations
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use("/api/v1", productRoutes);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use(errorHandleMiddleware)
// After all your app.use() lines
app.get("/test", (req, res) => res.json({ message: "working" }));
app.post("/api/v1/password/forgot", (req, res) => res.json({ message: "direct route hit" }));

export default app;