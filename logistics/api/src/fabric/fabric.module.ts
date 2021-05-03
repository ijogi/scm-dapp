import { Module } from '@nestjs/common';
import { FabricService } from './fabric.service';
import { TrackableEventService } from './trackable-event-contract.service';

@Module({
  providers: [FabricService, TrackableEventService],
  exports: [FabricService, TrackableEventService],
})
export class FabricModule {}
