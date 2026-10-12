import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { SlotModule } from './slot/slot.module';
import { TimexModule } from './timex/timex.module';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule,VehicleModule,TimexModule,SlotModule],
})
export class AppModule {}
