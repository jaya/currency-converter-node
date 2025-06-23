import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transactions.entity';
import { ConvertService } from 'src/convert/convert.service';
import { User } from 'src/user/user.entity';
import { CreateTransactionDto, ResponseTransactionDto } from './transactions.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private readonly convertService: ConvertService,
  ) {}

  async create(transactionDto: CreateTransactionDto): Promise<ResponseTransactionDto> {
    try {
      const { userId, fromCurrency, toCurrency, fromValue } = transactionDto;
      const convertResponse = await this.convertService.convert({
        fromCurrency,
        toCurrency,
        fromValue,
      });
      const transaction = new Transaction();
      transaction.user = { id: userId };
      transaction.fromCurrency = fromCurrency;
      transaction.toCurrency = toCurrency;
      transaction.fromValue = fromValue;
      transaction.toValue = convertResponse.toValue;
      transaction.rate = convertResponse.rate;
      transaction.timestamp = new Date();

      const response = await this.transactionsRepository.save(transaction);

      return {
        transactionId: response.transactionId,
        userId: userId,
        fromCurrency: response.fromCurrency,
        toCurrency: response.toCurrency,
        fromValue: response.fromValue,
        toValue: response.toValue,
        rate: response.rate,
        timestamp: response.timestamp,
      };
    } catch (error: unknown) {
      console.error('Error creating transaction:', error);
      throw new Error('Failed to create Transaction');
    }
  }

  async getUserTransactions(userId: User['id']): Promise<Transaction[]> {
    try {
      console.log('Fetching transactions for user ID:', userId);
      return await this.transactionsRepository.find({
        where: { user: { id: userId } },
        order: { timestamp: 'DESC' },
      });
    } catch (error: unknown) {
      console.error('Error fetching user transactions:', error);
      throw new Error('Failed to fetch user transactions');
    }
  }
}
