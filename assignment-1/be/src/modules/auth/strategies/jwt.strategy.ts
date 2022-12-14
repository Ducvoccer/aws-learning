import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-jwt'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { authConfig, guardConfig } from 'config'
import { AuthService } from '../auth.service'
import { Request } from 'express'
import { UserEntity } from 'modules/users/entities'

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, guardConfig.JWT) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: (req: Request) => {
        if (req && req.query && req.query?.token) {
          return req.query.token
        }
      },
      ignoreExpiration: authConfig.JWT_IGNORE_EXPIRATION,
      secretOrKey: authConfig.JWT_SECRET_KEY,
    })
  }

  async validate({ email }): Promise<UserEntity> | null {
    const user = await this.authService.validateUser(email)
    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}
