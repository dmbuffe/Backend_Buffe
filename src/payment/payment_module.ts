import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PaymentService } from './payment_service';
import { PaymentController } from './payment_controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}