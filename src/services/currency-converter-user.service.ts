import { DataSource } from "typeorm";
import { CurrencyConverterUserRepository } from "../repositories/currency-converter-user.repository";

export class CurrencyConverterUserService {
  private currencyConverterUserRepository: CurrencyConverterUserRepository
  constructor(private databaseConnection: DataSource) {
    this.currencyConverterUserRepository = new CurrencyConverterUserRepository(this.databaseConnection)
  }

  public async getUserById(id: number): Promise<void> {
    try {
      const queryUserResult = await this.currencyConverterUserRepository.findCurrencyConverterUserById(id);
      if (!queryUserResult) {
        throw new Error('USER_NOT_FOUND_WITH_ID ' + id)
      }
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }
}
