import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ShipmentContractService } from 'src/fabric/shipment-contract.service';
import { ShipUnitDto } from './dto/ship-unit.dto';

@Controller('ship-unit')
export class ShipUnitController {
  constructor(private shipmentContract: ShipmentContractService) {}

  @Post()
  createShipUnit(@Body() shipUnit: ShipUnitDto) {
    return this.shipmentContract.createShippingUnit(shipUnit);
  }

  @Get('/:id')
  getTransaction(@Param('id') id: string) {
    return this.shipmentContract.getTransaction(id);
  }
}
