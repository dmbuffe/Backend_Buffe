import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { TimexService } from './timex.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('timex')
export class TimexController {
  constructor(private timexService: TimexService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.timexService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.timexService.findById(+id);
  }

  @Post()
  async create(
    @Body() body: { entry_time: string; exit_time: string; role?: string },
  ) {
    return this.timexService.createTimex(
      body.entry_time,
      body.exit_time,
      body.role,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.timexService.updateTimex(+id, body);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.timexService.deleteTimex(+id);
  }
}