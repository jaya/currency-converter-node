import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Transaction } from './transactions.entity';
import { TransactionDto } from './transactions.dto';
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
    const transactionDto: TransactionDto = {
      id: 1,
      userId: 1,
      fromCurrency: 'USD' as Currencies,
      toCurrency: 'EUR' as Currencies,
      fromValue: 92,
      timestamp: new Date(),
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
});
