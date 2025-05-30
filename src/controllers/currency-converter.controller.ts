import { Request, Response } from 'express';

export const getCurrencyConversion = (req: Request, res: Response) => {
    res.json({ message: 'GET Current Conversion successful' });
};

