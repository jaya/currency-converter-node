import { Module } from '@nestjs/common';
import { ConvertController } from './convert/convert.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [ConvertController],
})
export class AppModule {}
