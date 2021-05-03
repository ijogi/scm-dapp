import { TrackableEventDto } from './dto/trackable-event.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { TrackableEventService } from 'src/fabric/trackable-event-contract.service';

@Controller('track')
export class TrackController {
  constructor(private trackableEventSvc: TrackableEventService) {}

  @Post()
  registerPickup(@Body() event: TrackableEventDto) {
    return this.trackableEventSvc.registerPickup(event);
  }

  @Post()
  registerInboundTransit(@Body() event: TrackableEventDto) {
    return this.trackableEventSvc.registerInboundTransit(event);
  }

  @Post()
  registerArrivalToProcessingCenter(@Body() event: TrackableEventDto) {
    return this.trackableEventSvc.registerArrivalToProcessingCenter(event);
  }

  @Post()
  registerOutboundTransit(@Body() event: TrackableEventDto) {
    return this.trackableEventSvc.registerArrivalToProcessingCenter(event);
  }

  @Post()
  registerDelivery(@Body() event: TrackableEventDto) {
    return this.trackableEventSvc.registerArrivalToProcessingCenter(event);
  }
}
