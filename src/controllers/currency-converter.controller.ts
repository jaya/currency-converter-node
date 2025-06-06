import { Request, Response } from 'express';
import { CurrencyConverterService } from '../services/currency-converter.service';
import { ValidateQueryParams } from '../dto/validate-query-params';
import { ConvertCurrencyDTO } from '../interfaces/convert-currency-dto.interface';
import { CurrencyType } from '../interfaces/currency-type.interface';

export const getCurrencyConversion = (req: Request, res: Response) => {
  try {
    const validator = new ValidateQueryParams();
    const queryParams: ConvertCurrencyDTO = {
      fromCurrency: req.query.fromCurrency as CurrencyType,
      toCurrency: req.query.toCurrency as CurrencyType,
      fromValue: req.query.fromValue as string
    };

    const validatedParams = validator.validateCurrencyParams(queryParams);

    const currencyConverterService = new CurrencyConverterService();
    const conversionResult = currencyConverterService.convertCurrencyAndGetTaxes(validatedParams)

    //TODO: Save into database
    res.json({ message: 'Current Conversion successful' });
  } catch (error: any) {
    console.error("ERROR_VALIDATE_DTO " + error.message);
    res.status(400).json({ Error: error.message })
  }

};
