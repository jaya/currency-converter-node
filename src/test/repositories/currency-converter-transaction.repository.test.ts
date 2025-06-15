import { DataSource, InsertResult, Repository } from "typeorm";
import { CurrencyConverterTransactionRepository } from "../../repositories/currency-converter-transaction.repository";
import { CurrencyConverterTransactionEntity } from "../../entities/currency-converter-transaction.entity";

describe("CurrencyConverterTransactionRepository", () => {
    let repository: CurrencyConverterTransactionRepository;
    let mockDataSource: jest.Mocked<DataSource>;
    let mockRepo: jest.Mocked<Repository<CurrencyConverterTransactionEntity>>;

    const mockTransactionData: CurrencyConverterTransactionEntity = {
        userId: 1,
        fromCurrency: 'USD',
        toCurrency: 'BRL',
        fromValue: 100,
        toValue: 500,
        rate: 5.0,
        transactionTimestamp: '2025-06-01T00:00:000Z'
    };

    const mockInsertResult: InsertResult = {
        identifiers: [{ id: 1 }],
        generatedMaps: [{ id: 1, createdAt: new Date() }],
        raw: {}
    };

    beforeEach(() => {
        mockRepo = {
            insert: jest.fn().mockResolvedValue(mockInsertResult),
        } as unknown as jest.Mocked<Repository<CurrencyConverterTransactionEntity>>;

        mockDataSource = {
            getRepository: jest.fn().mockReturnValue(mockRepo),
        } as unknown as jest.Mocked<DataSource>;

        repository = new CurrencyConverterTransactionRepository(mockDataSource);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("insertCurrencyConverterTransaction", () => {
        it("should call repository.insert with correct data", async () => {
            await repository.insertCurrencyConverterTransaction(mockTransactionData);

            expect(mockRepo.insert).toHaveBeenCalledWith(mockTransactionData);
            expect(mockDataSource.getRepository).toHaveBeenCalledWith(
                CurrencyConverterTransactionEntity
            );
        });

        it("should return InsertResult when successful", async () => {
            const result = await repository.insertCurrencyConverterTransaction(mockTransactionData);

            expect(result).toEqual(mockInsertResult);
        });

        it("should throw error when repository.insert fails", async () => {
            const errorMessage = "Database error";
            mockRepo.insert.mockRejectedValue(new Error(errorMessage));

            await expect(repository.insertCurrencyConverterTransaction(mockTransactionData))
                .rejects.toThrow(errorMessage);
        });

        it("should handle empty transaction data", async () => {
            const emptyData = {} as CurrencyConverterTransactionEntity;
            await repository.insertCurrencyConverterTransaction(emptyData);

            expect(mockRepo.insert).toHaveBeenCalledWith(emptyData);
        });

        it("should propagate TypeORM specific errors", async () => {
            const typeOrmError = {
                name: "QueryFailedError",
                message: "SQL error: duplicate key",
                code: "23505"
            };
            mockRepo.insert.mockRejectedValue(typeOrmError);

            await expect(repository.insertCurrencyConverterTransaction(mockTransactionData))
                .rejects.toThrow("SQL error: duplicate key");
        });

        it("should handle partial transaction data", async () => {
            const partialData = {
                userId: 2,
                fromCurrency: 'EUR'
            } as CurrencyConverterTransactionEntity;

            await repository.insertCurrencyConverterTransaction(partialData);

            expect(mockRepo.insert).toHaveBeenCalledWith(partialData);
        });
    });
});