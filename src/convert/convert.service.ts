import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import currencyapi from '@everapi/currencyapi-js';
import { ConvertDto, ConvertServiceResponse } from './convert.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConvertService {
  constructor(private readonly configService: ConfigService) {}

  async convert(convertDto: ConvertDto): Promise<ConvertServiceResponse> {
    const { fromCurrency, toCurrency, fromValue } = convertDto;
    if (!fromCurrency || !toCurrency || !fromValue) {
      throw new HttpException('Invalid conversion parameters', HttpStatus.BAD_REQUEST);
    }

    const currencyApiKey: string | undefined = this.configService.get('CURRENCY_API_KEY');
    if (!currencyApiKey) {
      throw new HttpException('Missing CURRENCY_API_KEY', HttpStatus.UNAUTHORIZED);
    }

    try {
      const client = new currencyapi(currencyApiKey);
      const response = await client.latest({
        base_currency: fromCurrency,
        currencies: toCurrency,
      });

      const toCurrencyValue: number = response.data[toCurrency].value;

      return {
        toValue: toCurrencyValue * fromValue,
        rate: toCurrencyValue,
      };
    } catch (error) {
      console.error('Currency conversion error:', error);
      throw new HttpException('Currency conversion failed', HttpStatus.BAD_GATEWAY);
    }
  }
}
