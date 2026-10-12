import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SlotService } from './slot.service';
import { SlotController } from './slot_controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [SlotController],
  providers: [SlotService],
  exports: [SlotService],
})
export class SlotModule {}