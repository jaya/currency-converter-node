import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transactions.entity';
import { TransactionDto } from './transactions.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  async create(transactionDto: TransactionDto): Promise<Transaction> {
    try {
      const { userId, fromCurrency, toCurrency, fromValue, toValue, rate } = transactionDto;
      const transaction = new Transaction();
      transaction.user = { id: userId };
      transaction.fromCurrency = fromCurrency;
      transaction.toCurrency = toCurrency;
      transaction.fromValue = fromValue;
      transaction.toValue = toValue;
      transaction.rate = rate;
      transaction.timestamp = new Date();
      return await this.transactionsRepository.save(transaction);
    } catch (error: unknown) {
      console.error('Error creating transaction:', error);
      throw new Error('Failed to create Transaction');
    }
  }
}
