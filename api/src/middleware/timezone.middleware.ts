import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TimezoneMiddleware implements NestMiddleware {
  use(req: any, res: Response, next: NextFunction) {
    req.timezone = req.header('Client-Location') || '';
    next();
  }
}
