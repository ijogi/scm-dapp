import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FabricModule } from './fabric/fabric.module';
import { TrackableEventModule } from './trackable-event/trackable-event.module';

@Module({
  imports: [FabricModule, TrackableEventModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
