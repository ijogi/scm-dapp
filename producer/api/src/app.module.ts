import { Module } from '@nestjs/common';
import { ShipUnitModule } from './ship-unit/ship-unit.module';
import { TrackableEntityModule } from './trackable-entity/trackable-entity.module';
import { FabricModule } from './fabric/fabric.module';

@Module({
  imports: [ShipUnitModule, TrackableEntityModule, FabricModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
