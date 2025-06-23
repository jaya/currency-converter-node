export type Currencies = 'BRL' | 'USD' | 'EUR' | 'JPY';

export class ConvertDto {
  fromCurrency: Currencies;
  toCurrency: Currencies;
  fromValue: number;
}

export type ConvertServiceResponse = {
  toValue: number;
  rate: number;
};
