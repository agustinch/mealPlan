import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/decorators/decorators.custom';
import { AuthService } from './auth.service';
import { JwtRefreshAuthGuard } from './jwt-refresh.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const access_token = req.cookies?.['access_token'];
    const tokens = await this.authService.refresh(access_token, req.user);
    console.log(tokens);
    res.cookie('access_token', tokens?.access_token, {
      path: '/',
      httpOnly: true,
    });
    res.cookie('refresh_token', tokens?.refresh_token, {
      path: '/auth/refresh',
      httpOnly: true,
    });

    return {};
  }
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) res) {
    const tokens = await this.authService.login(req.user);
    res.cookie('refresh_token', tokens?.refresh_token, {
      path: '/',
      httpOnly: true,
    });
    res.cookie('access_token', tokens?.access_token, {
      path: '/',
      httpOnly: true,
    });

    res.status(200);
  }
}
