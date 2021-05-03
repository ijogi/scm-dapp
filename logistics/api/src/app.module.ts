import { Module } from '@nestjs/common';
import { FabricModule } from './fabric/fabric.module';
import { TrackModule } from './track/track.module';

@Module({
  imports: [FabricModule, TrackModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
