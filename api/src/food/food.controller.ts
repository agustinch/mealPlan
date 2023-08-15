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
import { formatFoodUserStock } from 'src/utils/formatters';

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
        { show_on_list: true, ...createFoodDto },
      );

    return this.foodService.create({ ...createFoodDto, user_id: req.user.id });
  }

  @Get()
  async findAllFoodStockByUser(@Req() req) {
    const foods = await this.foodService.findAllFoodStockByUser(req.user.id);

    return foods.map((f) => formatFoodUserStock(f));
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

  @Patch('/:food_id')
  update(
    @Req() req,
    @Param('food_id') food_id: string,
    @Body() updateFood: UpdateFoodDto,
  ) {
    if (
      updateFood.fridge_amount < 0 ||
      (updateFood.frozen_amount !== null && updateFood.frozen_amount < 0)
    )
      throw new BadRequestException('El monto no puede ser menor de 0');

    return this.foodService.updateFoodStock(+food_id, req.user.id, updateFood);
  }

  @Patch('/:food_id/add')
  addFood(
    @Req() req,
    @Param('food_id') food_id: string,
    @Body() updateFood: UpdateFoodStockAmount,
  ) {
    if (
      (updateFood.fridge_amount && updateFood.fridge_amount < 0) ||
      (updateFood.frozen_amount && updateFood.frozen_amount < 0)
    )
      throw new BadRequestException('El monto no puede ser menor o igual a 0');

    return this.foodService.addFood(+food_id, req.user.id, updateFood);
  }

  @Patch('/:food_id/defrozen')
  defrozenFood(
    @Req() req,
    @Param('food_id') food_id: string,
    @Body() updateFood: { frozen_amount: number },
  ) {
    if (updateFood.frozen_amount && updateFood.frozen_amount < 0)
      throw new BadRequestException('El monto no puede ser menor o igual a 0');

    return this.foodService.defrozenFood(+food_id, req.user.id, updateFood);
  }

  @Delete(':food_id')
  remove(@Req() req, @Param('food_id') food_id: string) {
    return this.foodService.remove(+food_id, req.user.id);
  }
}
