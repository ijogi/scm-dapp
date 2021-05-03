import { Module } from '@nestjs/common';
import { FabricModule } from 'src/fabric/fabric.module';
import { TrackController } from './track.controller';

@Module({
  imports: [FabricModule],
  controllers: [TrackController],
})
export class TrackModule {}
