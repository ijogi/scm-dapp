import { Module } from '@nestjs/common';
import { FabricModule } from './fabric/fabric.module';
import { TrackModule } from './track/track.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [FabricModule, TrackModule, TransactionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
