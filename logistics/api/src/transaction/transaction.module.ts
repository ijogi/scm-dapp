import { Module } from '@nestjs/common';
import { FabricModule } from 'src/fabric/fabric.module';
import { TransactionController } from './transaction.controller';

@Module({
  imports: [FabricModule],
  controllers: [TransactionController],
})
export class TransactionModule {}
