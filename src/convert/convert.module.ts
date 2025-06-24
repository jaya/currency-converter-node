import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConvertService } from './convert.service';

@Module({
  imports: [ConfigModule],
  providers: [ConvertService],
  exports: [ConvertService],
})
export class ConvertModule {}
