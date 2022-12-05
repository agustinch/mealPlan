import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { PlateService } from './plate.service';
import { CreatePlateDto } from './dto/create-plate.dto';
import { UpdatePlateDto } from './dto/update-plate.dto';
import { IPlate } from '@global/entities';
import { formatPlate } from 'src/utils/formatters';

@Controller('plate')
export class PlateController {
  constructor(private readonly plateService: PlateService) {}

  @Post()
  create(@Req() req, @Body() createPlateDto: CreatePlateDto) {
    return this.plateService.create({
      user_id: req.user.id,
      ...createPlateDto,
    });
  }

  @Get()
  async findAll(): Promise<IPlate[]> {
    const plates = await this.plateService.findAll();

    return plates.map((p) => formatPlate(p));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plateService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlateDto: UpdatePlateDto) {
    return this.plateService.update(+id, updatePlateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plateService.remove(+id);
  }
}
