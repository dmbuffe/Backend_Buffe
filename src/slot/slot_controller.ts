import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SlotService } from './slot.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('slot')
export class SlotController {
  constructor(private slotService: SlotService) {}


  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.slotService.getAll();
  }


  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.slotService.findById(+id);
  }


  @Post()
  async create(
    @Body()
    body: {
      floor_level: string;
      slot_status: string;
      slot_number: number;
      vehicle_id: number;
      role?: string;
    },
  ) {
    return this.slotService.createSlot(
      body.floor_level,
      body.slot_status,
      body.slot_number,
      body.vehicle_id,
      body.role,
    );
  }


  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.slotService.updateSlot(+id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.slotService.deleteSlot(+id);
  }
}