import dotenv from 'dotenv';
dotenv.config({ quiet: true });
import express, { Request, Response } from 'express';
import userRoutes from './routes/userRoutes';
import { authenticateToken } from './middleware/userMiddleware';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Whiteboard API is running');
});

app.use('/api/user', userRoutes);

// Protected route example
app.get('/api/protected', authenticateToken, (req: Request, res: Response) => {
  res.json({ 
    message: 'This is a protected route', 
    user: req.user 
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

export default app;
