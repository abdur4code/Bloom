import express from "express"
import authRoutes from "../routes/auth.route.js"
import productRoutes from "../routes/product.route.js"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

/**
 * @Auth Routes /api/auth
 */
app.use('/api/auth', authRoutes);

/**
 * @Product Routes /api/products
 */
app.use('/api/products', productRoutes);
export default app;