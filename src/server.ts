import app from './app'
import dotenv from 'dotenv';
import { AppDataSource } from './config/ormconfig';

dotenv.config();
const url = process.env.APP_URL ?? '';
const port = process.env.PORT ?? '';
AppDataSource.initialize().then(() => {
  app.listen(port, () => {
    console.log(`[server]: Server is running at ${url}:${port}`);
  });
});
