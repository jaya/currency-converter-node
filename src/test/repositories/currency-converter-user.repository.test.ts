import { DataSource, Repository } from "typeorm";
import { CurrencyConverterUserRepository } from "../../repositories/currency-converter-user.repository";
import { CurrencyConverterUserEntity } from "../../entities/currency-converter-user.entity";

describe("CurrencyConverterUserRepository", () => {
  let repository: CurrencyConverterUserRepository;
  let mockDataSource: jest.Mocked<DataSource>;
  let mockRepo: jest.Mocked<Repository<CurrencyConverterUserEntity>>;

  const mockUser: CurrencyConverterUserEntity = {
    id: 123,
    name: "John Doe",
  };

  beforeEach(() => {
    mockRepo = {
      findOne: jest.fn().mockResolvedValue(mockUser),
    } as unknown as jest.Mocked<Repository<CurrencyConverterUserEntity>>;

    mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockRepo),
    } as unknown as jest.Mocked<DataSource>;

    repository = new CurrencyConverterUserRepository(mockDataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findCurrencyConverterUserById", () => {
    it("should call repository.findOne with correct id", async () => {
      const testId = 1;
      await repository.findCurrencyConverterUserById(testId);

      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { id: testId },
      });
      expect(mockDataSource.getRepository).toHaveBeenCalledWith(CurrencyConverterUserEntity);
    });

    it("should return user when found", async () => {
      const testId = 1;
      const result = await repository.findCurrencyConverterUserById(testId);

      expect(result).toEqual(mockUser);
    });

    it("should return null when user not found", async () => {
      const testId = 999;
      mockRepo.findOne.mockResolvedValue(null);

      const result = await repository.findCurrencyConverterUserById(testId);

      expect(result).toBeNull();
    });

    it("should handle repository errors", async () => {
      const testId = 1;
      const errorMessage = "Database error";
      mockRepo.findOne.mockRejectedValue(new Error(errorMessage));

      await expect(repository.findCurrencyConverterUserById(testId)).rejects.toThrow(errorMessage);
    });

    it("should handle empty where clause", async () => {
      const testId = 1;
      await repository.findCurrencyConverterUserById(testId);

      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { id: testId },
      });
    });
  });
});
