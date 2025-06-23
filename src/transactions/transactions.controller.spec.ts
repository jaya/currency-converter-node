import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Transaction } from './transactions.entity';
import { CreateTransactionDto } from './transactions.dto';
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
  let controller: TransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: {
            create: jest.fn().mockResolvedValue(new Transaction()),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a transaction', async () => {
    const transactionDto: CreateTransactionDto = {
      userId: 1,
      fromCurrency: 'USD' as Currencies,
      toCurrency: 'EUR' as Currencies,
      fromValue: 92,
    };
    const result = await controller.createTransaction(transactionDto);
    expect(result).toBeInstanceOf(Transaction);
  });

  it('should handle errors when creating a transaction', async () => {
    const transactionDto = {
      id: 1,
      userId: 1,
      fromCurrency: 'USD' as Currencies,
      toCurrency: 'EUR' as Currencies,
      fromValue: 100,
      timestamp: new Date(),
    };
    jest
      .spyOn(controller, 'createTransaction')
      .mockRejectedValue(new Error('Failed to create transaction'));

    await expect(controller.createTransaction(transactionDto)).rejects.toThrow(
      'Failed to create transaction',
    );
  });

  describe('getUserTransactions', () => {
    it('should return user transactions', async () => {
      const userId = 1;
      const transactions = [new Transaction()];
      jest.spyOn(controller, 'getUserTransactions').mockResolvedValue(transactions);

      const result = await controller.getUserTransactions(userId);
      expect(result).toEqual(transactions);
    });

    it('should throw an error if userId is not provided', async () => {
      await expect(controller.getUserTransactions(undefined as any)).rejects.toThrow(
        'User ID is required',
      );
    });

    it('should handle errors when fetching user transactions', async () => {
      const userId = 1;
      jest
        .spyOn(controller, 'getUserTransactions')
        .mockRejectedValue(new Error('Failed to fetch user transactions'));

      await expect(controller.getUserTransactions(userId)).rejects.toThrow(
        'Failed to fetch user transactions',
      );
    });
  });
});
