import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TimexService } from './timex.service';
import { TimexController } from './timex.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [TimexController],
  providers: [TimexService],
  exports: [TimexService],
})
export class TimexModule {}