import { Module } from '@nestjs/common';
import { FabricService } from 'src/fabric/fabric.service';
import { ShipmentContractService } from 'src/fabric/shipment-contract.service';

@Module({
  providers: [FabricService, ShipmentContractService],
  exports: [FabricService, ShipmentContractService],
})
export class FabricModule {}
