import { DataSource } from "typeorm";
import { CurrencyConverterUserRepository } from "../repositories/currency-converter-user.repository";
import logger from "../config/logs/logger";

export class CurrencyConverterUserService {
  private currencyConverterUserRepository: CurrencyConverterUserRepository;
  constructor(private databaseConnection: DataSource) {
    this.currencyConverterUserRepository = new CurrencyConverterUserRepository(this.databaseConnection);
  }

  public async getUserById(id: number): Promise<void> {
    try {
      const queryUserResult = await this.currencyConverterUserRepository.findCurrencyConverterUserById(id);
      if (!queryUserResult) {
        throw new Error("USER_NOT_FOUND_WITH_ID " + id);
      }
      logger.info(`RESULT_USER_FIND: ${JSON.stringify(queryUserResult)}`)
    } catch (error: any) {
      logger.error(`ERROR_RESULT_USER_FIND: ${error?.message}`)
      throw new Error(error?.message);
    }
  }
}
