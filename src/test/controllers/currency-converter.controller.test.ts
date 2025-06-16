import request from 'supertest';
import app from '../../app';
import { AppDataSource } from '../../config/ormconfig';
import { DataSource } from 'typeorm';
import { CurrencyConverterUserEntity } from '../../entities/currency-converter-user.entity';
import { ConversionResultInterface } from '../../interfaces/conversion-result.interface';
import { SaveTransactionInterface } from '../../interfaces/save-transaction.interface';


const conversionResult: ConversionResultInterface = {
  fromCurrency: 'USD',
  toCurrency: 'BRL',
  fromValue: 900,
  toValue: 17.16,
  rate: 0.1790163769,
  timestamp: '2025-06-05T23:59:59Z'
};
const mockConvertCurrency = jest.fn().mockResolvedValue(conversionResult);

jest.mock('../../services/currency-converter.service', () => ({
  CurrencyConverterService: jest.fn().mockImplementation(() => ({
    convertCurrencyAndGetTaxes: mockConvertCurrency
  }))
}));

const resultSaveTransaction: SaveTransactionInterface = {
  transactionId: 2,
  userId: 3,
  fromCurrency: 'USD',
  toCurrency: 'BRL',
  fromValue: 900,
  toValue: 17.16,
  rate: 0.1790163769,
  timestamp: '2025-06-05T23: 59: 59.000Z'
}

const mockSaveTransaction = jest.fn().mockResolvedValue(resultSaveTransaction);

jest.mock('../../services/currency-converter-transaction.service', () => ({
  CurrencyConverterTransactionService: jest.fn().mockImplementation(() => ({
    createCurrencyConverterTransaction: mockSaveTransaction
  }))
}));

describe('User Controller', () => {

  let connection: DataSource;

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
    jest.spyOn(console, 'error').mockImplementation(() => { });
    jest.spyOn(console, 'warn').mockImplementation(() => { });
  });
  beforeAll(async () => {
    connection = await AppDataSource.initialize();

    await connection.synchronize(true);

    const userRepository = connection.getRepository(CurrencyConverterUserEntity);
    await userRepository.save({
      id: 3,
      name: 'Test User',
    });
  });

  afterAll(async () => {
    mockConvertCurrency.mockReset();

    await connection.destroy();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('GET /transactions should return status code equal 200', async () => {
    const response = await request(app)
      .get('/transactions')
      .query({
        fromCurrency: 'USD',
        toCurrency: 'BRL',
        fromValue: '900',
        userId: '3'
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(resultSaveTransaction);
  });
  it('GET /transactions should return status code equal 400', async () => {
    const response = await request(app).get('/transactions');
    expect(response.status).toBe(400);
  });

  it('should return 400 for missing toCurrency query parameters', async () => {
    const response = await request(app)
      .get('/transactions')
      .query({
        fromCurrency: 'USD',
        fromValue: '100',
        userId: '1'
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ "Error": "Missing toCurrency query parameter" })
  });
  it('should return 400 for missing fromCurrency query parameters', async () => {
    const response = await request(app)
      .get('/transactions')
      .query({
        toCurrency: 'BRL',
        fromValue: '100',
        userId: '1'
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ "Error": "Missing fromCurrency query parameter" })
  });

  it('should return 400 for invalid fromCurrency types', async () => {
    const response = await request(app)
      .get('/transactions')
      .query({
        fromCurrency: 'INVALID',
        toCurrency: 'BRL',
        fromValue: '100',
        userId: '1'
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ "Error": "The fromCurrency property must be one of: BRL, USD, EUR, JPY" })
  });
  it('should return 400 for invalid toCurrency types', async () => {
    const response = await request(app)
      .get('/transactions')
      .query({
        fromCurrency: 'BRL',
        toCurrency: 'INVALID',
        fromValue: '100',
        userId: '1'
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ "Error": "The toCurrency property must be one of: BRL, USD, EUR, JPY" })
  });
  it('should return 400 for missing fromValue query parameter', async () => {
    const response = await request(app)
      .get('/transactions')
      .query({
        fromCurrency: 'BRL',
        toCurrency: 'INVALID',
        userId: '1'
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ "Error": "Missing fromValue query parameter" })
  });
  it('should return 400 for fromValue is not a numer', async () => {
    const response = await request(app)
      .get('/transactions')
      .query({
        fromCurrency: 'BRL',
        toCurrency: 'USD',
        fromValue: 'aaaa',
        userId: '1'
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ "Error": "The query parameter fromValue must be a number" })
  });
  it('should return 400 for missing userId query parameter', async () => {
    const response = await request(app)
      .get('/transactions')
      .query({
        fromCurrency: 'BRL',
        toCurrency: 'USD',
        fromValue: '100'
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ "Error": "Missing userId query parameter" })
  });

});
