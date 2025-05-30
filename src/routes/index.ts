import { Router } from 'express';
import { getCurrencyConversion } from '../controllers/currency-converter.controller';

const router = Router();

router.get('/currency-converter', getCurrencyConversion);

export default router;