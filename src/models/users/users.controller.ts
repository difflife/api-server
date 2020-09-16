import { Body, Controller, Delete, Get, Param, Post, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './user.entity'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor (private readonly usersService: UsersService) {}

  @Post()
  create (@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto)
  }

  @Get()
  findAll (): Promise<User[]> {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
    // return this.usersService.findAll()
  }

  /**
   * 如果需要自定义内部管道行为，则需要实例化
   */
  @Get(':id')
  findOne (
    // @Param('id', ParseIntPipe) id: string
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string
  ): Promise<User> {
    return this.usersService.findOne(id)
  }

  @Delete(':id')
  remove (@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id)
  }
}
