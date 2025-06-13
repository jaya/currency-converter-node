import { DataSource, InsertResult, Repository } from "typeorm";
import { CurrencyConverterTransactionEntity } from "../entities/currency-converter-transaction.entity";


export class CurrencyConverterTransactionRepository {
  private currencyConverterUserRepo: Repository<CurrencyConverterTransactionEntity>;
  constructor(private databaseConnection: DataSource) {
    this.currencyConverterUserRepo = this.databaseConnection.getRepository(CurrencyConverterTransactionEntity)
  }

  async insertCurrencyConverterTransaction(dataToSaveTransaction: CurrencyConverterTransactionEntity): Promise<InsertResult> {
    try {
      return await this.currencyConverterUserRepo.insert(dataToSaveTransaction);
    } catch (error: any) {
      throw Error(error?.message)
    }
  }
}
