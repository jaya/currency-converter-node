import { CurrencyConverterService } from '../services/currency-converter.service';
import { CallApiService } from '../services/call-api.service';
import { ValidatedConvertCurrency } from '../interfaces/convert-currency-dto.interface';
import { ConversionResultInterface } from '../interfaces/conversion-result.interface';
import { CurrencyType } from '../interfaces/currency-type.interface';
import { AxiosResponse } from 'axios';

jest.mock('../services/call-api.service', () => {
  return {
    CallApiService: jest.fn().mockImplementation(() => ({
      callApiWithGetAndParams: jest.fn()
    }))
  };
});


describe('CurrencyConverterService', () => {
  let service: CurrencyConverterService;
  let mockCallApiService: jest.Mocked<CallApiService>;

  const mockValidatedParams: ValidatedConvertCurrency = {
    fromCurrency: CurrencyType.BRL,
    toCurrency: CurrencyType.USD,
    fromValue: 100
  };

  const mockApiResponse: AxiosResponse = {
    data: {
      data: {
        USD: {
          value: 0.2
        }
      },
      meta: {
        last_updated_at: '2025-06-05T00:00:00Z'
      }
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {
      headers: null as any,
      url: '',
      method: 'get'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();

    process.env.API_KEY = 'test-api-key';
    process.env.API_URL = 'https://api.example.com';

    service = new CurrencyConverterService();

    mockCallApiService = new (CallApiService as jest.MockedClass<typeof CallApiService>)() as jest.Mocked<CallApiService>;

    mockCallApiService.callApiWithGetAndParams.mockResolvedValueOnce(mockApiResponse)
  });

  it('service object should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call API with correct parameters', async () => {
    await service.convertCurrencyAndGetTaxes(mockValidatedParams);

    expect(mockCallApiService.callApiWithGetAndParams).toHaveBeenCalledWith(
      process.env.API_URL,
      {
        apikey: process.env.API_KEY,
        base_currency: CurrencyType.BRL,
        currencies: CurrencyType.USD
      }
    );
  });

  it('should return correct conversion result', async () => {
    const result = await service.convertCurrencyAndGetTaxes(mockValidatedParams);

    const expectedResult: ConversionResultInterface = {
      fromCurrency: CurrencyType.BRL,
      toCurrency: CurrencyType.USD,
      fromValue: 100,
      toValue: 20,
      rate: 0.2,
      timestamp: '2025-06-05T00:00:00Z'
    };

    expect(result).toEqual(expectedResult);
  });

});
