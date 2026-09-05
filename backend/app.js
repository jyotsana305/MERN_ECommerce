import express from "express";
import productRoutes from "./routes/productRoutes.js";
import user from "./routes/userRoutes.js";
import order from "./routes/orderRoutes.js";
import payment from "./routes/paymentRoutes.js";
import errorHandleMiddleware from "./middleware/error.js";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";

const app = express();
// Express 5 defaults to the 'simple' query parser, which leaves bracket
// notation (e.g. price[gte]=100) as a literal flat key instead of expanding
// it into a nested object. APIFunctionality.filter() (price range filtering)
// relies on the nested shape, so restore the classic 'extended' (qs-based) parser.
app.set('query parser','extended')
app.use(express.json())
app.use(cookieParser())
app.use(fileUpload())
// Allow the frontend (a different origin outside of the Vite dev proxy,
// e.g. a deployed build) to call this API with cookies attached.
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});
// app.use((req, res, next) => {
//     console.log(`${req.method} ${req.url}`);
//     next();
// });
app.use("/api/v1", productRoutes);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);
// Error-handling middleware must be registered after all routes, otherwise
// errors thrown by routes registered later never reach it.
app.use(errorHandleMiddleware)

export default app;