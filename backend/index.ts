import express, { Request, Response } from 'express';
import sql from './db';

const app = express();
const port = 5000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

export default app;
