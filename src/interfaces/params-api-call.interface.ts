export interface ParamsApiCallInteface {
  apikey: string;
  base_currency: string;
  currencies: string;
}
interface ConvertCurrencyDTO {
  fromCurrency: string;
  fromValue: number;
  toCurrency: string;
}
