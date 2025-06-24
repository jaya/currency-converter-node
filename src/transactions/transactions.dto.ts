import { ApiProperty } from '@nestjs/swagger';
import { Currencies } from 'src/convert/convert.dto';
import { User } from 'src/user/user.entity';

export class CreateTransactionDto {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ enum: Currencies, example: Currencies.BRL })
  fromCurrency: Currencies;

  @ApiProperty({ enum: Currencies, example: Currencies.USD })
  toCurrency: Currencies;

  @ApiProperty({ example: 100 })
  fromValue: number;
}

export class ResponseTransactionDto {
  @ApiProperty()
  transactionId: number;

  @ApiProperty()
  userId: User['id'];

  @ApiProperty({ enum: Currencies })
  fromCurrency: Currencies;

  @ApiProperty({ enum: Currencies })
  toCurrency: Currencies;

  @ApiProperty()
  fromValue: number;

  @ApiProperty()
  toValue: number;

  @ApiProperty()
  rate: number;

  @ApiProperty()
  timestamp: Date;
}
