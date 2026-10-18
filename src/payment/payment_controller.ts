import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment_service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.paymentService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.paymentService.findById(+id);
  }

  @Post()
  async create(
    @Body()
    body: {
      payment_date: string;
      payment_amount: number;
      payment_method: string;
      record_id: number;
      role?: string;
    },
  ) {
    return this.paymentService.createPayment(
      body.payment_date,
      body.payment_amount,
      body.payment_method,
      body.record_id,
      body.role,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.paymentService.updatePayment(+id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.paymentService.deletePayment(+id);
  }
}