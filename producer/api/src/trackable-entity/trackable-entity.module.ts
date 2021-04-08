import { Module } from '@nestjs/common';
import { FabricModule } from 'src/fabric/fabric.module';
import { TrackableEntityController } from './trackable-entity.controller';

@Module({
  imports: [FabricModule],
  controllers: [TrackableEntityController],
})
export class TrackableEntityModule {}
