import { Body, Get, Param } from '@nestjs/common';
import { Controller, Post } from '@nestjs/common';
import { ShipmentContractService } from 'src/fabric/shipment-contract.service';

@Controller('trackable-entity')
export class TrackableEntityController {
  constructor(private shipmentContract: ShipmentContractService) {}

  @Post()
  createTrackableEntity(@Body() trackableEntity) {
    return this.shipmentContract.createTrackableEntity(trackableEntity);
  }

  @Get('/:id')
  getTransaction(@Param('id') id: string) {
    return this.shipmentContract.getTransaction(id);
  }
}
