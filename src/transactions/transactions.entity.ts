import { Currencies } from 'src/convert/convert.dto';
import { User } from 'src/user/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  transactionId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  fromCurrency: Currencies;

  @Column()
  toCurrency: Currencies;

  @Column('decimal')
  fromValue: number;

  @Column('decimal')
  toValue: number;

  @Column('decimal')
  rate: number;

  @Column('timestamp')
  timestamp: Date;
}
