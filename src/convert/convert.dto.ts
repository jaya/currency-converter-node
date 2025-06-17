export type Currencies = 'BRL' | 'USD' | 'EUR' | 'JPY';

export class ConvertDto {
  baseCurrency: Currencies;
  endCurrency: Currencies;
  baseValue: number;
}
