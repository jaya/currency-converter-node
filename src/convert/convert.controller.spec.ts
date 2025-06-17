import { Test, TestingModule } from '@nestjs/testing';
import { ConvertController } from './convert.controller';
import { ConfigService } from '@nestjs/config';

jest.mock('@everapi/currencyapi-js', () => {
  return {
    default: jest.fn().mockImplementation(() => ({
      latest: jest.fn().mockResolvedValue({
        data: {
          EUR: { value: 0.92 },
        },
      }),
    })),
  };
});

describe('ConvertController', () => {
  let controller: ConvertController;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConvertController],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('fake-api-key'),
          },
        },
      ],
    }).compile();

    controller = module.get<ConvertController>(ConvertController);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('converts correctly from USD to EUR', async () => {
    const response = await controller.convert({
      baseCurrency: 'USD',
      endCurrency: 'EUR',
      baseValue: 1000,
    });

    expect(response).toBe(920);
  });

  it('should throw an error for invalid conversion parameters', async () => {
    await expect(controller.convert({
      baseCurrency: 'USD',
      endCurrency: undefined as any,
      baseValue: 1000,
    })).rejects.toThrow('Invalid conversion parameters');
  });

  it('should throw an error if CURRENCY_API_KEY is missing', async () => {
    jest.spyOn(configService, 'get').mockReturnValue(undefined);

    await expect(controller.convert({
      baseCurrency: 'USD',
      endCurrency: 'EUR',
      baseValue: 1000,
    })).rejects.toThrow('Missing CURRENCY_API_KEY');
  });

  it('should throw an error if currency conversion fails', async () => {
    const currencyapi = (await import('@everapi/currencyapi-js')).default;
    (currencyapi as jest.Mock).mockImplementationOnce(() => ({
      latest: jest.fn().mockRejectedValue(new Error('API error')),
    }));

    await expect(controller.convert({
      baseCurrency: 'USD',
      endCurrency: 'EUR',
      baseValue: 1000,
    })).rejects.toThrow('Currency conversion failed');
  });
});
