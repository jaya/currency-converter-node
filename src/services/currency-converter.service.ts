import { ConversionResultInterface } from '../interfaces/conversion-result.interface';
import { ValidatedConvertCurrency } from '../interfaces/convert-currency-dto.interface';
import { ParamsApiCallInteface } from '../interfaces/params-api-call.interface';
import { CallApiService } from './call-api.service';

export class CurrencyConverterService {
  constructor(private callApiService: CallApiService) {}
  async convertCurrencyAndGetTaxes(validatedParams: ValidatedConvertCurrency) {
    const { fromCurrency, toCurrency, fromValue } = validatedParams;
    const params: ParamsApiCallInteface = {
      apikey: process.env.API_KEY ?? '',
      base_currency: fromCurrency ?? '',
      currencies: toCurrency ?? '',
    };

    const apiUrl = process.env.API_URL ?? '';

    const apiResult = await this.callApiService.callApiWithGetAndParams(
      apiUrl,
      params
    );

    const rate = apiResult?.data.data.USD.value;
    const timestamp = apiResult?.data?.meta.last_updated_at;

    const toValue = fromValue * rate;

    const conversionResult: ConversionResultInterface = {
      fromCurrency: fromCurrency ?? '',
      toCurrency: toCurrency ?? '',
      fromValue: fromValue,
      toValue: parseFloat(toValue.toFixed(4)),
      rate,
      timestamp,
    };
    return conversionResult;
  }
}
