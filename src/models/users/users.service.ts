import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './user.entity'
import { Login } from '../auth/interfaces/login'

@Injectable()
export class UsersService {
  constructor (
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async login (login: Login) {
    const { password, ...rest } = login
    const user: User = await this.findOne(rest)

    if (!user) {
      throw new Error('账号不存在')
    }

    if (password !== user.password) {
      throw new Error('密码错误')
    }

    return user
  }

  create (createUserDto: CreateUserDto): Promise<User> {
    const user = new User()
    for (const key in createUserDto) {
      user[key] = createUserDto[key]
    }

    return this.usersRepository.save(user)
  }

  findAll (): Promise<User[]> {
    return this.usersRepository.find()
  }

  findOneById (id: string): Promise<User> {
    return this.usersRepository.findOne(id)
  }

  findOne (account): Promise<User> {
    return this.usersRepository.findOne(account)
  }

  remove (id: string): Promise<any> {
    return this.usersRepository.delete(id)
  }
}
