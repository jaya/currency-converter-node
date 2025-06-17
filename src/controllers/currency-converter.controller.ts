import { Request, Response } from "express";
import { CurrencyConverterService } from "../services/currency-converter.service";
import { ValidateQueryParams } from "../dto/validate-query-params";
import { ConvertCurrencyDTO } from "../interfaces/convert-currency-dto.interface";
import { CurrencyType } from "../interfaces/currency-type.interface";
import { CallApiService } from "../services/call-api.service";
import { CurrencyConverterTransactionService } from "../services/currency-converter-transaction.service";
import { CurrencyConverterTransactionEntity } from "../entities/currency-converter-transaction.entity";
import { AppDataSource } from "../config/ormconfig";
import { CurrencyConverterUserService } from "../services/currency-converter-user.service";
import logger from "../config/logs/logger";

export const getCurrencyConversion = async (req: Request, res: Response) => {
  try {
    const validator = new ValidateQueryParams();
    const queryParams: ConvertCurrencyDTO = {
      fromCurrency: req.query.fromCurrency as CurrencyType,
      toCurrency: req.query.toCurrency as CurrencyType,
      fromValue: req.query.fromValue as string,
      userId: req.query.userId as string,
    };

    const validatedParams = validator.validateCurrencyParams(queryParams);

    const callApiService = new CallApiService();
    const currencyConverterService = new CurrencyConverterService(callApiService);
    const conversionResult = await currencyConverterService.convertCurrencyAndGetTaxes(validatedParams);

    const currencyConverterUserService = new CurrencyConverterUserService(AppDataSource);
    await currencyConverterUserService.getUserById(1);
    const currencyConverterTransactionService = new CurrencyConverterTransactionService(AppDataSource);
    const dataToSaveTransaction: CurrencyConverterTransactionEntity = {
      userId: parseInt(queryParams.userId ?? ""),
      fromCurrency: conversionResult?.fromCurrency,
      toCurrency: conversionResult?.toCurrency,
      fromValue: conversionResult?.fromValue,
      toValue: conversionResult?.toValue,
      rate: conversionResult?.rate,
      transactionTimestamp: conversionResult?.timestamp,
    };
    const currencyConverterResult = await currencyConverterTransactionService.createCurrencyConverterTransaction(dataToSaveTransaction);
    logger.info(`RESULT_TRANSACTION: ${JSON.stringify(currencyConverterResult)}`)
    res.json(currencyConverterResult);
  } catch (error: any) {
    logger.error("ERROR_RESULT_TRANSACTION:" + error.message);
    res.status(400).json({ Error: error.message });
  }
};
