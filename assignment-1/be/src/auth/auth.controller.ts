import { Body, Controller, Post, UseGuards, Res, Get, Req, HttpStatus, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Response, Request } from 'express'
import { authConfig } from 'config'
import { AuthService } from './auth.service'
import { AuthenticationGuard } from './guards'

@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService, private readonly authService: AuthService) {}

  @Get('/login')
  async getLogin(@Res() res: Response, @Req() req: Request) {
    // check cookie exist
    const cookie = req.cookies[authConfig.COOKIE_NAME]
    // get user from cookie
    const decodeCookie = this.jwtService.decode(cookie) || {}

    console.log('decodeCookie::', decodeCookie)

    if (decodeCookie['id']) {
      try {
        this.jwtService.verify(cookie)
      } catch (err) {
        console.log('verify cookie error::', err.message)

        throw new UnauthorizedException('verify cookie error')
      }

      // user is logged in
      return res.status(HttpStatus.OK).redirect(`/users/home`)
    }

    return res.status(HttpStatus.OK).render('shared/login')
  }

  @Post('/login')
  async login(@Body() data: any, @Res() res: Response): Promise<any> {
    const { email, password } = data
    const resp = await this.authService.login(email, password)

    if (resp['error']) {
      console.log('login error::', resp.error)
      return res.status(HttpStatus.NOT_FOUND).json(resp).end()
    }

    const token = this.jwtService.sign({
      id: resp.id,
      email: resp.email,
    })

    res.cookie(authConfig.COOKIE_NAME, token, {
      expires: new Date(Date.now() + authConfig.COOKIE_EXPIRES_TIME),
    })

    return res.status(HttpStatus.OK).json({ status: 'ok' }).end()
  }

  @UseGuards(AuthenticationGuard)
  @Get('/logout')
  async logout(@Req() req: any, @Res() res: Response) {
    // remove cookie
    return res.status(HttpStatus.OK).clearCookie(authConfig.COOKIE_NAME).redirect('login')
  }

  // @UseGuards(AuthenticationGuard)
  @Get('/not_found')
  async getNotFound(@Res() res: Response) {
    return res.status(HttpStatus.NOT_FOUND).render('shared/not-found')
  }
}