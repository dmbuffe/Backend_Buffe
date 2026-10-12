import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('vehicle')
export class VehicleController {
  constructor(private vehicleService: VehicleService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.vehicleService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.vehicleService.findById(+id);
  }

  @Post()
  async create(
    @Body() body: { vehicle_number: number; vehicle_type: string; role?: string },
  ) {
    return this.vehicleService.createVehicle(
      body.vehicle_number,
      body.vehicle_type,
      body.role,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.vehicleService.updateVehicle(+id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.vehicleService.deleteVehicle(+id);
  }
}