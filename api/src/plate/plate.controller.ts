import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PlateService } from './plate.service';
import { CreatePlateDto } from './dto/create-plate.dto';
import { UpdatePlateDto } from './dto/update-plate.dto';

@Controller('plate')
export class PlateController {
  constructor(private readonly plateService: PlateService) {}

  @Post()
  create(@Body() createPlateDto: CreatePlateDto) {
    return this.plateService.create(createPlateDto);
  }

  @Get()
  async findAll() {
    const plates = await this.plateService.findAll();

    return plates.map((p) => ({
      id: p.id,
      name: p.name,
      image: p.image,
      ingredientes: p.ingredientes.map((f) => ({
        ...f.food,
        amount: f.amount,
      })),
    }));
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
