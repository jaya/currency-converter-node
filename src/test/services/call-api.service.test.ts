import axios, { AxiosResponse } from "axios";
import { CallApiService } from "../../services/call-api.service";
import { ParamsApiCallInteface } from "../../interfaces/params-api-call.interface";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("CallApiService", () => {
  let service: CallApiService;
  const mockUrl = "https://api.example.com/data";
  const mockParams: ParamsApiCallInteface = {
    base_currency: "USD",
    currencies: "BRL",
    apikey: "apiKeyMock",
  };
  const mockResponseData = {
    success: true,
    rate: 5.25,
    convertedAmount: 525,
  };
  const mockResponse: AxiosResponse = {
    data: mockResponseData,
    status: 200,
    statusText: "OK",
    headers: {},
    config: {
      headers: null as any,
      url: "",
      method: "get",
    },
  };

  beforeEach(() => {
    service = new CallApiService();
    mockedAxios.get.mockReset();
  });

  describe("callApiWithGetAndParams", () => {
    it("should call axios.get with correct url and params", async () => {
      mockedAxios.get.mockResolvedValue(mockResponse);

      await service.callApiWithGetAndParams(mockUrl, mockParams);

      expect(mockedAxios.get).toHaveBeenCalledWith(mockUrl, { params: mockParams });
    });

    it("should return the axios response when successful", async () => {
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await service.callApiWithGetAndParams(mockUrl, mockParams);

      expect(result).toEqual(mockResponse);
      expect(result.data).toEqual(mockResponseData);
    });

    it("should throw error when axios.get fails", async () => {
      const errorMessage = "Network Error";
      mockedAxios.get.mockRejectedValue(new Error(errorMessage));

      await expect(service.callApiWithGetAndParams(mockUrl, mockParams)).rejects.toThrow(errorMessage);
    });

    it("should throw error with message when axios returns error response", async () => {
      const errorResponse = {
        response: {
          status: 400,
          data: {
            error: "Invalid parameters",
          },
        },
        message: "Bad Request",
      };
      mockedAxios.get.mockRejectedValue(errorResponse);

      await expect(service.callApiWithGetAndParams(mockUrl, mockParams)).rejects.toThrow("Bad Request");
    });

    it("should handle empty params object", async () => {
      mockedAxios.get.mockResolvedValue(mockResponse);
      const emptyParams = {} as ParamsApiCallInteface;

      await service.callApiWithGetAndParams(mockUrl, emptyParams);

      expect(mockedAxios.get).toHaveBeenCalledWith(mockUrl, { params: emptyParams });
    });

    it("should propagate axios error with all details", async () => {
      const detailedError = {
        message: "Timeout",
        config: { timeout: 5000 },
        code: "ECONNABORTED",
        response: {
          status: 504,
          data: { error: "Gateway Timeout" },
        },
      };
      mockedAxios.get.mockRejectedValue(detailedError);

      try {
        await service.callApiWithGetAndParams(mockUrl, mockParams);
        fail("Should have thrown an error");
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe("Timeout");
      }
    });
  });
});
