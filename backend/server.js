import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {connectDB} from "./config/db.js";

import farmRoutes from "./routes/farm.routes.js";
import userRoute from "./routes/user.route.js";

dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:5173', // frontend URL
    credentials: true               // allow cookies if needed
}));
const PORT = process.env.PORT || 3000;

app.use(express.json()); // allows us to accept json data in the req.body.

app.use("/api/farms", farmRoutes);

app.use("/api/users", userRoute);

app.listen(PORT, () => {
    connectDB();
    console.log('Server running at http://localhost:'+PORT);
});


