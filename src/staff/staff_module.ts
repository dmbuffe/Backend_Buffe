import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { StaffService } from './staff_service';
import { StaffController } from './staff_controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [StaffController],
  providers: [StaffService],
  exports: [StaffService],
})
export class StaffModule {}