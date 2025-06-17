import { DataSource, Repository } from "typeorm";
import { CurrencyConverterUserEntity } from "../entities/currency-converter-user.entity";

export class CurrencyConverterUserRepository {
  private currencyConverterUserRepo: Repository<CurrencyConverterUserEntity>;
  constructor(private databaseConnection: DataSource) {
    this.currencyConverterUserRepo = this.databaseConnection.getRepository(CurrencyConverterUserEntity);
  }

  async findCurrencyConverterUserById(id: number): Promise<CurrencyConverterUserEntity | null> {
    return await this.currencyConverterUserRepo.findOne({
      where: { id },
    });
  }
}
