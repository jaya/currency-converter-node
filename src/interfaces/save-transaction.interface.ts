export interface SaveTransactionInterface {
  transactionId?: number;
  userId: number;
  fromCurrency: string;
  toCurrency: string;
  fromValue: number;
  toValue: number;
  rate: number;
  timestamp: string;
}
