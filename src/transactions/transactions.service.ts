import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transactions.entity';
import { TransactionDto } from './transactions.dto';
import { ConvertService } from 'src/convert/convert.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private readonly convertService: ConvertService,
  ) {}

  async create(transactionDto: TransactionDto): Promise<Transaction> {
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

      return await this.transactionsRepository.save(transaction);
    } catch (error: unknown) {
      console.error('Error creating transaction:', error);
      throw new Error('Failed to create Transaction');
    }
  }
}
