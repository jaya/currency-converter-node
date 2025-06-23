/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { Repository } from 'typeorm';
import { Transaction } from './transactions.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConvertService } from '../convert/convert.service';
import { CreateTransactionDto } from './transactions.dto';
import { ConvertServiceResponse, Currencies } from 'src/convert/convert.dto';

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

describe('TransactionsService', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  let service: TransactionsService;
  let transactionsRepository: Repository<Transaction>;
  let convertService: ConvertService;

  const mockTransactionRepository = {
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockConvertService = {
    convert: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: getRepositoryToken(Transaction), useValue: mockTransactionRepository },
        { provide: ConvertService, useValue: mockConvertService },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    transactionsRepository = module.get(getRepositoryToken(Transaction));
    convertService = module.get<ConvertService>(ConvertService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a transaction DTO', async () => {
      const transactionDto: CreateTransactionDto = {
        userId: 1,
        fromCurrency: Currencies.USD,
        toCurrency: Currencies.EUR,
        fromValue: 100,
      };

      const convertResponse: ConvertServiceResponse = {
        toValue: 92,
        rate: 0.92,
      };

      const savedTransaction = {
        transactionId: 1,
        user: { id: 1 },
        fromCurrency: Currencies.USD,
        toCurrency: Currencies.EUR,
        fromValue: 100,
        toValue: 92,
        rate: 0.92,
        timestamp: new Date(),
      };

      mockConvertService.convert.mockResolvedValue(convertResponse);
      mockTransactionRepository.save.mockResolvedValue(savedTransaction);

      const result = await service.create(transactionDto);

      expect(convertService.convert).toHaveBeenCalledWith({
        fromCurrency: Currencies.USD,
        toCurrency: Currencies.EUR,
        fromValue: 100,
      });

      expect(transactionsRepository.save).toHaveBeenCalled();

      expect(result).toEqual({
        transactionId: savedTransaction.transactionId,
        userId: savedTransaction.user.id,
        fromCurrency: Currencies.USD,
        toCurrency: Currencies.EUR,
        fromValue: 100,
        toValue: 92,
        rate: 0.92,
        timestamp: expect.any(Date),
      });
    });

    it('should throw an error if repository save fails', async () => {
      mockConvertService.convert.mockResolvedValue({
        toValue: 92,
        rate: 0.92,
      });

      mockTransactionRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(
        service.create({
          userId: 1,
          fromCurrency: Currencies.USD,
          toCurrency: Currencies.EUR,
          fromValue: 100,
        }),
      ).rejects.toThrow('Failed to create Transaction');
    });
  });

  describe('getUserTransactions', () => {
    it('should return transactions for the user', async () => {
      const userId = 1;

      const transactions = [
        {
          transactionId: 1,
          user: { id: 1 },
          fromCurrency: Currencies.USD,
          toCurrency: Currencies.EUR,
          fromValue: 100,
          toValue: 92,
          rate: 0.92,
          timestamp: new Date(),
        },
      ];

      mockTransactionRepository.find.mockResolvedValue(transactions);

      const result = await service.getUserTransactions(userId);

      expect(transactionsRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        order: { timestamp: 'DESC' },
      });

      expect(result).toEqual([
        {
          transactionId: 1,
          userId: 1,
          fromCurrency: Currencies.USD,
          toCurrency: Currencies.EUR,
          fromValue: 100,
          toValue: 92,
          rate: 0.92,
          timestamp: expect.any(Date),
        },
      ]);
    });

    it('should throw an error if fetching transactions fails', async () => {
      mockTransactionRepository.find.mockRejectedValue(new Error('Database error'));

      await expect(service.getUserTransactions(1)).rejects.toThrow(
        'Failed to fetch user transactions',
      );
    });
  });
});
