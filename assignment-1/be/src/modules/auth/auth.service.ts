import { Injectable } from '@nestjs/common'
import { Bcrypt } from 'shared/external'
import { UsersService } from 'modules/users/users.service'
import { UserEntity } from 'modules/users/entities'

@Injectable()
export class AuthService {
  bcrypt: Bcrypt

  constructor(private usersService: UsersService) {
    this.bcrypt = new Bcrypt()
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmailAndPassword(email, password)

    const error = 'information login is incorrect'
    if (!user) {
      console.log('can not find user')
      return { error: error }
    }

    return { id: user.id, email: user.email }
  }

  async validateUser(email: string): Promise<UserEntity> | null {
    const user = await this.usersService.findByEmail(email)

    if (!user) {
      return null
    }

    return user
  }
}
