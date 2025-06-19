import { Body, Controller, Post } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionDto } from './transactions.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}
  @Post()
  async createTransaction(@Body() transactionDto: TransactionDto) {
    return await this.transactionService.create(transactionDto);
  }
}
