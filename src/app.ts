import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from './routes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/', router);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

export default app;