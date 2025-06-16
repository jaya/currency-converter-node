import { DataSource } from "typeorm";
import { CurrencyConverterUserService } from "../../services/currency-converter-user.service";
import { CurrencyConverterUserRepository } from "../../repositories/currency-converter-user.repository";

jest.mock("../../repositories/currency-converter-user.repository");

describe("CurrencyConverterUserService", () => {
  let service: CurrencyConverterUserService;
  let mockDataSource: jest.Mocked<DataSource>;
  let mockRepository: jest.Mocked<CurrencyConverterUserRepository>;

  beforeEach(() => {
    mockDataSource = {} as jest.Mocked<DataSource>;
    mockRepository = {
      findCurrencyConverterUserById: jest.fn(),
    } as unknown as jest.Mocked<CurrencyConverterUserRepository>;

    (CurrencyConverterUserRepository as jest.Mock).mockImplementation(() => {
      return mockRepository;
    });

    service = new CurrencyConverterUserService(mockDataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserById", () => {
    it("should call repository with correct id", async () => {
      const testId = 1;
      mockRepository.findCurrencyConverterUserById.mockResolvedValue({ id: testId } as any);

      await service.getUserById(testId);

      expect(mockRepository.findCurrencyConverterUserById).toHaveBeenCalledWith(testId);
    });

    it("should not throw error when user is found", async () => {
      const testId = 1;
      mockRepository.findCurrencyConverterUserById.mockResolvedValue({ id: testId } as any);

      await expect(service.getUserById(testId)).resolves.not.toThrow();
    });

    it("should throw USER_NOT_FOUND_WITH_ID error when user is not found", async () => {
      const testId = 999;
      mockRepository.findCurrencyConverterUserById.mockResolvedValue(null);

      await expect(service.getUserById(testId)).rejects.toThrow(`USER_NOT_FOUND_WITH_ID ${testId}`);
    });

    it("should propagate repository errors", async () => {
      const testId = 1;
      const mockError = new Error("Database error");
      mockRepository.findCurrencyConverterUserById.mockRejectedValue(mockError);

      await expect(service.getUserById(testId)).rejects.toThrow(mockError.message);
    });
  });
});
