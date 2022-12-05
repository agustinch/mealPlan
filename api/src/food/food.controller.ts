import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FoodService } from './food.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodStockAmount, UpdateFoodDto } from './dto/update-food.dto';
import { Public } from 'src/decorators/decorators.custom';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post()
  create(@Req() req, @Body() createFoodDto: CreateFoodDto) {
    const foodStock = createFoodDto?.food_id
      ? this.foodService.findOne(createFoodDto.food_id, req.user.id)
      : undefined;

    if (foodStock)
      return this.foodService.updateShowOnList(
        createFoodDto.food_id,
        req.user.id,
        { show_on_list: true, order: createFoodDto?.order },
      );

    return this.foodService.create({ ...createFoodDto, user_id: req.user.id });
  }

  @Get()
  async findAllFoodStockByUser(@Req() req) {
    const foods = await this.foodService.findAllFoodStockByUser(req.user.id);

    return foods.map((f) => ({
      id: f.food_id,
      name: f.Food.name,
      image: f.Food.image,
      amount: f.amount,
      Unit: f.Unit,
      show_on_list: f.show_on_list,
      order: f.order,
    }));
  }

  @Get('/suggestion')
  async findAllFoodSuggestion(@Req() req) {
    const foods = await this.foodService.findAllSuggestionFood();

    return foods.map((f) => ({
      id: f.id,
      name: f.name,
      image: f.image,
    }));
  }
  @Get('/units')
  findAllUnits() {
    return this.foodService.findAllUnits();
  }

  @Patch('/:food_id/amount')
  updateAmount(
    @Req() req,
    @Param('food_id') food_id: string,
    @Body() updateAmount: UpdateFoodStockAmount,
  ) {
    if (updateAmount.amount < 0)
      throw new BadRequestException('El monto no puede ser menor de 0');

    return this.foodService.updateAmount(+food_id, req.user.id, updateAmount);
  }

  @Delete(':food_id')
  remove(@Req() req, @Param('food_id') food_id: string) {
    return this.foodService.remove(+food_id, req.user.id);
  }
}
