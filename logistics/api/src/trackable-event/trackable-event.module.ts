import { Module } from '@nestjs/common';
import { TrackableEventController } from './trackable-event.controller';

@Module({
  controllers: [TrackableEventController]
})
export class TrackableEventModule {}
