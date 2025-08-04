import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from "./config/db.js";

import cartRoutes from "./routes/cart.routes.js";
import farmRoutes from "./routes/farm.routes.js";
import orderRoutes from "./routes/order.routes.js";
import productRoutes from "./routes/product.routes.js";
import userRoute from "./routes/user.route.js";

dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:3000', // frontend URL
    credentials: true               // allow cookies if needed
}));
const PORT = process.env.PORT || 3000;

app.use(express.json()); // allows us to accept json data in the req.body.

app.use("/api/farms", farmRoutes);

app.use("/api/users", userRoute);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log('Server running at http://localhost:'+PORT);
});


