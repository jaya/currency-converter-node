import { Request, Response } from 'express';

export const getCurrencyConversion = (req: Request, res: Response) => {
  res.json({ message: 'Current Conversion successful' });
};
