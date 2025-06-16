import { DataSource, InsertResult } from "typeorm";
import { CurrencyConverterTransactionService } from "../../services/currency-converter-transaction.service";
import { CurrencyConverterTransactionRepository } from "../../repositories/currency-converter-transaction.repository";
import { CurrencyConverterTransactionEntity } from "../../entities/currency-converter-transaction.entity";
import { SaveTransactionInterface } from "../../interfaces/save-transaction.interface";

jest.mock("../../repositories/currency-converter-transaction.repository");

describe("CurrencyConverterTransactionService", () => {
  let service: CurrencyConverterTransactionService;
  let mockDataSource: jest.Mocked<DataSource>;
  let mockRepository: jest.Mocked<CurrencyConverterTransactionRepository>;

  const mockTransactionData: CurrencyConverterTransactionEntity = {
    userId: 123,
    fromCurrency: "USD",
    toCurrency: "BRL",
    fromValue: 100,
    toValue: 500,
    rate: 5.0,
    transactionTimestamp: "2025-06-01T00:00:000Z",
  };

  const mockSaveResult: InsertResult = {
    identifiers: [{ transactionId: 123 }],
    generatedMaps: [{ transactionTimestamp: "2025-06-01T00:00:00.000Z" }],
    raw: {},
  };

  const expectedReturn: SaveTransactionInterface = {
    transactionId: 123,
    userId: 123,
    fromCurrency: "USD",
    toCurrency: "BRL",
    fromValue: 100,
    toValue: 500,
    rate: 5.0,
    timestamp: "2025-06-01T00:00:00.000Z",
  };

  beforeEach(() => {
    mockDataSource = {} as jest.Mocked<DataSource>;
    mockRepository = {
      insertCurrencyConverterTransaction: jest.fn().mockResolvedValue(mockSaveResult),
    } as unknown as jest.Mocked<CurrencyConverterTransactionRepository>;

    (CurrencyConverterTransactionRepository as jest.Mock).mockImplementation(() => {
      return mockRepository;
    });

    service = new CurrencyConverterTransactionService(mockDataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createCurrencyConverterTransaction", () => {
    it("should call repository with correct transaction data", async () => {
      await service.createCurrencyConverterTransaction(mockTransactionData);

      expect(mockRepository.insertCurrencyConverterTransaction).toHaveBeenCalledWith(mockTransactionData);
    });

    it("should return correct transaction data when successful", async () => {
      const result = await service.createCurrencyConverterTransaction(mockTransactionData);

      expect(result).toEqual(expectedReturn);
    });

    it("should handle empty save result with default values", async () => {
      mockRepository.insertCurrencyConverterTransaction.mockResolvedValue({
        identifiers: [{ transactionId: 123 }],
        generatedMaps: [{ transactionTimestamp: "2025-06-01T00:00:00.000Z" }],
        raw: {},
      });

      const result = await service.createCurrencyConverterTransaction(mockTransactionData);
      expect(result.transactionId).toBe(123);
      expect(result.userId).toBe(123);
      expect(result.fromCurrency).toBe("USD");
      expect(result.toCurrency).toBe("BRL");
      expect(result.fromValue).toBe(100);
      expect(result.toValue).toBe(500);
      expect(result.rate).toBe(5);
      expect(result.timestamp).toBe("2025-06-01T00:00:00.000Z");
    });

    it("should propagate repository errors", async () => {
      const mockError = new Error("Database error");
      mockRepository.insertCurrencyConverterTransaction.mockRejectedValue(mockError);

      await expect(service.createCurrencyConverterTransaction(mockTransactionData)).rejects.toThrow(mockError.message);
    });
    it("should properly handle and propagate repository exceptions", async () => {
      const testCases = [
        {
          description: "should handle generic Error",
          error: new Error("Database connection failed"),
          expectedMessage: "Database connection failed",
        },
        {
          description: "should handle TypeORM specific error",
          error: {
            name: "QueryFailedError",
            message: "SQL error: constraint violation",
            code: "23505",
          },
          expectedMessage: "SQL error: constraint violation",
        },
      ];

      for (const testCase of testCases) {
        mockRepository.insertCurrencyConverterTransaction.mockRejectedValueOnce(testCase.error);

        await expect(service.createCurrencyConverterTransaction(mockTransactionData)).rejects.toThrow(testCase.expectedMessage);

        expect(mockRepository.insertCurrencyConverterTransaction).toHaveBeenCalledWith(mockTransactionData);

        jest.clearAllMocks();
      }
    });

    it("should include original error message when throwing new error", async () => {
      const detailedError = new Error("Detailed database error: connection timeout");
      mockRepository.insertCurrencyConverterTransaction.mockRejectedValue(detailedError);

      try {
        await service.createCurrencyConverterTransaction(mockTransactionData);
        fail("Should have thrown an error");
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(detailedError.message);
        expect(error.message).toContain("connection timeout");
      }
    });
  });
});
