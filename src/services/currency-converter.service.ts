import { ConversionResultInterface } from "../interfaces/conversion-result.interface";
import { ParamsApiCallInteface } from "../interfaces/params-api-call.interface";
import { CallApiService } from "./call-api.service";

export class CurrencyConverterService {
  constructor() { }
  async convertCurrencyAndGetTaxes(fromCurrency: string, fromValue: number, toCurrency: string) {
    const params: ParamsApiCallInteface = {
      apikey: process.env.API_KEY ?? '',
      base_currency: fromCurrency,
      currencies: toCurrency
    }
    const apiUrl = process.env.API_URL ?? '';
    const callApiService = new CallApiService();
    const apiResult = await callApiService.callApiWithGetAndParams(apiUrl, params);
    const rate = apiResult.data.data.USD.value;
    const timestamp = apiResult.data.meta.last_updated_at;

    const toValue = fromValue * rate;

    const conversionResult: ConversionResultInterface = {
      fromCurrency,
      toCurrency,
      fromValue,
      toValue: parseFloat(toValue.toFixed(4)),
      rate,
      timestamp
    };
    console.log(conversionResult);
  }
}
