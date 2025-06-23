import { Currencies } from 'src/convert/convert.dto';
import { User } from 'src/user/user.entity';

export type TransactionDto = {
  id: number;
  userId: User['id'];
  fromCurrency: Currencies;
  toCurrency: Currencies;
  fromValue: number;
  timestamp: Date;
};
