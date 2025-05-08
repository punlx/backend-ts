// src/index.ts

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import todoRoutes from './routes/todos';
import authRoutes from './routes/auth';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

const corsOptions = {
  origin: ['http://localhost:3000', 'https://todo-frontend-ascs.onrender.com'],
  optionsSuccessStatus: 200,
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization',
};

app.use(cors(corsOptions));

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello TypeScript Express!' });
});

app.use('/todos', todoRoutes);

// 👇 Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: `test error: ${err.message}` || 'Internal Server Error' });
});

// เพิ่ม route auth
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
