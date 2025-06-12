import { DataSource } from 'typeorm';
import { CurrencyConverterUserEntity } from '../entities/currency-converter-user.entity';
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, APP_ENV } = process.env;
export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: parseInt(DB_PORT || "5432"),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  logging: APP_ENV === "dev" ? true : false,
  entities: [CurrencyConverterUserEntity],
});

