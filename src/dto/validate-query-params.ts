import { ConvertCurrencyDTO, ValidatedConvertCurrency } from "../interfaces/convert-currency-dto.interface";
import { CurrencyType } from "../interfaces/currency-type.interface";

export class ValidateQueryParams {

  private currencyType = CurrencyType;

  validateCurrencyParams(query: ConvertCurrencyDTO | null): ValidatedConvertCurrency {
    const validCurrencies = [this.currencyType.BRL, this.currencyType.USD, this.currencyType.EUR, this.currencyType.JPY];

    if (typeof query !== 'object' || query === null) {
      throw new Error('Invalid query parameters: expected an object');
    }
    if (!query.fromCurrency) {
      throw new Error('Missing fromCurrency query parameter');
    }
    if (!validCurrencies.includes(query.fromCurrency)) {
      throw new Error(`The fromCurrency property must be one of: ${validCurrencies.join(', ')}`);
    }

    if (!query.toCurrency) {
      throw new Error('Missing toCurrency query parameter');
    }

    if (!query.userId) {
      throw new Error('Missing userId query parameter');
    }

    const fromValueNumber = parseFloat(String(query.fromValue));
    if (!query.fromValue) {
      throw new Error('Missing fromValue query parameter');
    }
    if (isNaN(fromValueNumber)) {
      throw new Error('The query parameter fromValue must be a number');
    }
    if (fromValueNumber <= 0) {
      throw new Error('The query parameter fromValue must be greater than zero');
    }
    if (!validCurrencies.includes(query.toCurrency)) {
      throw new Error(`The toCurrency property must be one of: ${validCurrencies.join(', ')}`);
    }
    return {
      fromCurrency: query.fromCurrency,
      fromValue: fromValueNumber,
      toCurrency: query.toCurrency
    };
  }
}
