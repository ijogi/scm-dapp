import { Module } from '@nestjs/common';
import { FabricModule } from 'src/fabric/fabric.module';
import { ShipUnitController } from './ship-unit.controller';

@Module({
  imports: [FabricModule],
  controllers: [ShipUnitController],
})
export class ShipUnitModule {}
