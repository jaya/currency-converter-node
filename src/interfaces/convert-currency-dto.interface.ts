import { CurrencyType } from "./currency-type.interface";

export interface ConvertCurrencyDTO {
  fromCurrency: CurrencyType | null;
  fromValue: string;
  toCurrency: CurrencyType | null;
  userId: string | null;
}
export interface ValidatedConvertCurrency {
  fromCurrency: CurrencyType | null;
  fromValue: number;
  toCurrency: CurrencyType | null;
}
