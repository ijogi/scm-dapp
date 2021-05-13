import { Controller, Get, Param } from '@nestjs/common';
import { TrackableEventService } from 'src/fabric/trackable-event-contract.service';

@Controller('transaction')
export class TransactionController {
  constructor(private trackableEventSvc: TrackableEventService) {}

  @Get('/:id')
  getTransaction(@Param('id') id: string) {
    return this.trackableEventSvc.getTransaction(id);
  }

  @Get('/:id/history')
  getTransactionHistory(@Param('id') id: string) {
    return this.trackableEventSvc.getTransactionHistory(id);
  }
}
