import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShipUnitModule } from './ship-unit/ship-unit.module';
import { TrackableEntityModule } from './trackable-entity/trackable-entity.module';
import { FabricModule } from './fabric/fabric.module';

@Module({
  imports: [ShipUnitModule, TrackableEntityModule, FabricModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
