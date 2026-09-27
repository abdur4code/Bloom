import express from "express"
import authRoutes from "../routes/auth.route.js"
import productRoutes from "../routes/product.route.js"
import cookieParser from "cookie-parser"

const app = express();

app.use(express.json());
app.use(cookieParser());

/**
 * @Auth Routes /api/auth
 */
app.use('/api/auth', authRoutes);

/**
 * @Product Routes /api/auth
 */
app.use('/api/products', productRoutes);
export default app;