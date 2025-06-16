import { CurrencyType } from "../../interfaces/currency-type.interface";
import { ConvertCurrencyDTO } from "../../interfaces/convert-currency-dto.interface";
import { ValidateQueryParams } from "../../dto/validate-query-params";

describe("it should test the ValidateQueryParams Class", () => {
  let validator: ValidateQueryParams;

  beforeEach(() => {
    validator = new ValidateQueryParams();
  });

  describe("validate the currency parameter", () => {
    it("should throw error when query parameter is null", () => {
      expect(() => validator.validateCurrencyParams(null)).toThrow("Invalid query parameters: expected an object");
    });

    it("should throw error when query parameter is a empty object", () => {
      // @ts-expect-error
      expect(() => validator.validateCurrencyParams({})).toThrow("Missing fromCurrency query parameter");
    });

    it("should throw error when fromCurrency is missing", () => {
      const invalidQuery = {
        toCurrency: CurrencyType.USD,
        fromValue: "100",
      } as unknown as ConvertCurrencyDTO;

      expect(() => validator.validateCurrencyParams(invalidQuery)).toThrow("Missing fromCurrency query parameter");
    });

    it("should throw error when userId is missing", () => {
      const invalidQuery = {
        fromCurrency: CurrencyType.BRL,
        toCurrency: CurrencyType.USD,
        fromValue: "100",
      } as unknown as ConvertCurrencyDTO;
      expect(() => validator.validateCurrencyParams(invalidQuery)).toThrow("Missing userId query parameter");
    });

    it("should throw error when toCurrency is missing", () => {
      const invalidQuery = {
        fromCurrency: CurrencyType.BRL,
        fromValue: "100",
      } as unknown as ConvertCurrencyDTO;

      expect(() => validator.validateCurrencyParams(invalidQuery)).toThrow();
    });

    it("should throw error when fromCurrency is invalid", () => {
      const invalidQuery = {
        fromCurrency: "TEST",
        toCurrency: CurrencyType.USD,
        fromValue: "100",
      };
      // @ts-expect-error
      expect(() => validator.validateCurrencyParams(invalidQuery)).toThrow();
    });

    it("should throw error when toCurrency is missing", () => {
      const invalidQuery = {
        fromCurrency: CurrencyType.BRL,
        fromValue: "100",
      } as unknown as ConvertCurrencyDTO;

      expect(() => validator.validateCurrencyParams(invalidQuery)).toThrow();
    });

    it("should throw error when fromValue is missing", () => {
      const invalidQuery = {
        fromCurrency: CurrencyType.BRL,
        toCurrency: CurrencyType.USD,
      } as unknown as ConvertCurrencyDTO;

      expect(() => validator.validateCurrencyParams(invalidQuery)).toThrow();
    });

    it("should throw error when fromValue is not a number", () => {
      const invalidQuery = {
        fromCurrency: CurrencyType.BRL,
        toCurrency: CurrencyType.USD,
        fromValue: "test-mock",
        userId: "123",
      };

      expect(() => validator.validateCurrencyParams(invalidQuery)).toThrow();
    });

    it("should return validated params when all fields are valid", () => {
      const validQuery = {
        fromCurrency: CurrencyType.BRL,
        toCurrency: CurrencyType.USD,
        fromValue: "100",
        userId: "123",
      };

      const result = validator.validateCurrencyParams(validQuery);

      expect(result).toEqual({
        fromCurrency: CurrencyType.BRL,
        toCurrency: CurrencyType.USD,
        fromValue: 100,
      });
    });

    it("should accept all valid currency types", () => {
      const currencies = [CurrencyType.BRL, CurrencyType.USD, CurrencyType.EUR, CurrencyType.JPY];

      currencies.forEach((currency) => {
        const validQuery = {
          fromCurrency: currency,
          toCurrency: CurrencyType.USD,
          fromValue: "100",
          userId: "123",
        };

        expect(() => validator.validateCurrencyParams(validQuery)).not.toThrow();
      });
    });
  });
});
