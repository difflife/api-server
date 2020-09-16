import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './user.entity'

@Injectable()
export class UsersService {
  constructor (
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  create (createUserDto: CreateUserDto): Promise<User> {
    const user = new User()
    user.firstName = createUserDto.firstName
    user.lastName = createUserDto.lastName

    return this.usersRepository.save(user)
  }

  findAll (): Promise<User[]> {
    return this.usersRepository.find()
  }

  findOne (id: string): Promise<User> {
    return this.usersRepository.findOne(id)
  }

  remove (id: string): Promise<any> {
    return this.usersRepository.delete(id)
  }
}
