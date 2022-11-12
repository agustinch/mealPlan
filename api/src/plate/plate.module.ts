import { Module } from '@nestjs/common';
import { PlateService } from './plate.service';
import { PlateController } from './plate.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PlateController],
  providers: [PlateService, PrismaService],
})
export class PlateModule {}
