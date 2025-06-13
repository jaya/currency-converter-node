import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { CurrencyConverterUserEntity } from './currency-converter-user.entity';

@Entity('currency_converter_transaction')
export class CurrencyConverterTransactionEntity {
  @PrimaryGeneratedColumn({ name: 'transaction_id' })
  transactionId?: number | undefined;

  @ManyToOne(() => CurrencyConverterUserEntity, (user) => user.transactions)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: CurrencyConverterUserEntity | undefined

  @Column({ name: 'user_id' })
  userId: number | undefined;

  @Column({
    name: 'from_currency',
    type: 'char',
    length: 3,
    nullable: false,
  })
  fromCurrency: string | undefined;

  @Column({
    name: 'to_currency',
    type: 'char',
    length: 3,
    nullable: false,
  })
  toCurrency: string | undefined;

  @Column({
    name: 'from_value',
    type: 'numeric',
    precision: 15,
    scale: 2,
    nullable: false,
  })
  fromValue: number | undefined;

  @Column({
    name: 'to_value',
    type: 'numeric',
    precision: 15,
    scale: 2,
    nullable: false,
  })
  toValue: number | undefined;

  @Column({
    name: 'rate',
    type: 'numeric',
    precision: 10,
    scale: 6,
    nullable: false,
  })
  rate: number | undefined;

  @CreateDateColumn({
    name: 'transaction_timestamp',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  transactionTimestamp: string | undefined;
}
