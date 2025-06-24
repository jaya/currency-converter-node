/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, ResponseTransactionDto } from './transactions.dto';
import { Currencies } from '../convert/convert.dto';

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

describe('TransactionsController', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  let controller: TransactionsController;
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: {
            create: jest.fn(),
            getUserTransactions: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a transaction', async () => {
    const transactionDto: CreateTransactionDto = {
      userId: 1,
      fromCurrency: Currencies.USD,
      toCurrency: Currencies.EUR,
      fromValue: 92,
    };

    const mockResponse: ResponseTransactionDto = {
      transactionId: 1,
      userId: 1,
      fromCurrency: Currencies.USD,
      toCurrency: Currencies.EUR,
      fromValue: 92,
      toValue: 85,
      rate: 0.92,
      timestamp: new Date(),
    };

    jest.spyOn(service, 'create').mockResolvedValue(mockResponse);

    const result = await controller.createTransaction(transactionDto);
    expect(result).toEqual(mockResponse);
    expect(service.create).toHaveBeenCalledWith(transactionDto);
  });

  it('should handle errors when creating a transaction', async () => {
    const transactionDto: CreateTransactionDto = {
      userId: 1,
      fromCurrency: Currencies.USD,
      toCurrency: Currencies.EUR,
      fromValue: 92,
    };

    jest.spyOn(service, 'create').mockRejectedValue(new Error('Failed to create transaction'));

    await expect(controller.createTransaction(transactionDto)).rejects.toThrow(
      'Failed to create transaction',
    );
  });

  describe('getUserTransactions', () => {
    it('should return user transactions', async () => {
      const userId = 1;
      const transactions = [{ transactionId: 1 } as any];

      jest.spyOn(service, 'getUserTransactions').mockResolvedValue(transactions);

      const result = await controller.getUserTransactions(userId);
      expect(result).toEqual(transactions);
      expect(service.getUserTransactions).toHaveBeenCalledWith(userId);
    });

    it('should handle errors when fetching user transactions', async () => {
      const userId = 1;

      jest
        .spyOn(service, 'getUserTransactions')
        .mockRejectedValue(new Error('Failed to fetch user transactions'));

      await expect(controller.getUserTransactions(userId)).rejects.toThrow(
        'Failed to fetch user transactions',
      );
    });
  });
});
