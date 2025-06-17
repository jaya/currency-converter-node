import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import currencyapi from '@everapi/currencyapi-js';
import { ConvertDto } from './convert.dto';
import { ConfigService } from '@nestjs/config';

@Controller('convert')
export class ConvertController {
  constructor(private readonly configService: ConfigService) {}

  @Post()
  async convert(@Body() convertDto: ConvertDto): Promise<number> {
    const { baseCurrency, endCurrency, baseValue } = convertDto;
    if (!baseCurrency || !endCurrency || !baseValue) {
      throw new HttpException('Invalid conversion parameters', HttpStatus.BAD_REQUEST);
    }
    
    const currencyApiKey: string | undefined = this.configService.get('CURRENCY_API_KEY');
    if (!currencyApiKey) {
      throw new HttpException('Missing CURRENCY_API_KEY', HttpStatus.UNAUTHORIZED);
    }

    try {
      const client = new currencyapi(currencyApiKey);
      const response = await client.latest({
        base_currency: baseCurrency,
        currencies: endCurrency,
      });

      const endCurrencyValue: number = response.data[endCurrency].value;

      return endCurrencyValue * baseValue;
    } catch (error) {
      console.error('Currency conversion error:', error);
      throw new HttpException('Currency conversion failed', HttpStatus.BAD_GATEWAY);
    }
  }
}
