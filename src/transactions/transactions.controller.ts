import { Body, Controller, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, ResponseTransactionDto } from './transactions.dto';
import { User } from 'src/user/user.entity';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}

  @Post()
  @ApiBody({ type: CreateTransactionDto })
  async createTransaction(
    @Body() transactionDto: CreateTransactionDto,
  ): Promise<ResponseTransactionDto> {
    return await this.transactionService.create(transactionDto);
  }

  @Get()
  @ApiQuery({ name: 'userId', required: true })
  async getUserTransactions(@Query('userId', ParseIntPipe) userId: User['id']) {
    return await this.transactionService.getUserTransactions(userId);
  }
}
