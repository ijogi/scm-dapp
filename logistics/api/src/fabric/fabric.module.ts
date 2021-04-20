import { Module } from '@nestjs/common';
import { FabricService } from './fabric.service';

@Module({
  providers: [FabricService]
})
export class FabricModule {}
