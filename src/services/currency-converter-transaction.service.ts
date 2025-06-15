import { DataSource } from "typeorm";
import { CurrencyConverterTransactionRepository } from "../repositories/currency-converter-transaction.repository";
import { CurrencyConverterTransactionEntity } from "../entities/currency-converter-transaction.entity";
import { SaveTransactionInterface } from "../interfaces/save-transaction.interface";

export class CurrencyConverterTransactionService {
  private currencyConverterTranscationRepository: CurrencyConverterTransactionRepository
  constructor(private databaseConnection: DataSource) {
    this.currencyConverterTranscationRepository = new CurrencyConverterTransactionRepository(this.databaseConnection)
  }

  public async createCurrencyConverterTransaction(dataToSaveTransaction: CurrencyConverterTransactionEntity): Promise<SaveTransactionInterface> {
    try {
      const savingTransactionResult = await this.currencyConverterTranscationRepository.insertCurrencyConverterTransaction(dataToSaveTransaction);

      const objectToReturn: SaveTransactionInterface = {
        transactionId: savingTransactionResult?.identifiers[0]?.transactionId ?? 0,
        userId: dataToSaveTransaction?.userId ?? 0,
        fromCurrency: dataToSaveTransaction?.fromCurrency ?? '',
        toCurrency: dataToSaveTransaction?.toCurrency ?? '',
        fromValue: dataToSaveTransaction?.fromValue ?? 0,
        toValue: dataToSaveTransaction.toValue ?? 0,
        rate: dataToSaveTransaction?.rate ?? 0,
        timestamp: savingTransactionResult?.generatedMaps[0]?.transactionTimestamp ?? ''
      }
      return objectToReturn;
    } catch (error: any) {
      throw Error(error?.message)
    }
  }
}
