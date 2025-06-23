import { ApiProperty } from '@nestjs/swagger';

export enum Currencies {
  BRL = 'BRL',
  USD = 'USD',
  EUR = 'EUR',
  JPY = 'JPY',
}

export class ConvertDto {
  @ApiProperty({ enum: Currencies })
  fromCurrency: Currencies;

  @ApiProperty({ enum: Currencies })
  toCurrency: Currencies;

  @ApiProperty()
  fromValue: number;
}

export type ConvertServiceResponse = {
  toValue: number;
  rate: number;
};
