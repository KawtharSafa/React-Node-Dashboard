import express from 'express';
import cors from 'cors';
import helmet from 'helmet';


// importing rourtes
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

// Middleware for security and CORS handling. 
// Helmet helps secure the app by setting various HTTP headers
app.use(helmet());

app.use(cors());
app.use(express.json());


// routes
// used versioning for the api to make it more scalable and maintainable
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);


export default app;