import app from './app'
import dotenv from 'dotenv';

dotenv.config();
const url = process.env.APP_URL ?? '';
const port = process.env.PORT ?? '';

app.listen(port, () => {
    console.log(`[server]: Server is running at ${url}:${port}`);
});
