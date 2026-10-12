import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CategoryService } from './category.service';
import { CateagoryController } from './category.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [CateagoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
