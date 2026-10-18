import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { StaffService } from './staff_service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('staff')
export class StaffController {
  constructor(private staffService: StaffService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.staffService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.staffService.findById(+id);
  }

  @Post()
  async create(
    @Body()
    body: {
      staff_name: string;
      staff_contactno: string;
      id: number;
      role?: string;
    },
  ) {
    return this.staffService.createStaff(
      body.staff_name,
      body.staff_contactno,
      body.id,
      body.role,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.staffService.updateStaff(+id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.staffService.deleteStaff(+id);
  }
}