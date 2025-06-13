import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CurrencyConverterTransactionEntity } from './currency-converter-transaction.entity';

@Entity('currency_converter_user')
export class CurrencyConverterUserEntity {
  @PrimaryGeneratedColumn()
  id: number | undefined;
  @Column({ type: 'varchar', length: 50 })
  name: string | undefined;
  @OneToMany(() => CurrencyConverterTransactionEntity, (transaction) => transaction.user)
  transactions!: CurrencyConverterTransactionEntity[] | undefined
}
