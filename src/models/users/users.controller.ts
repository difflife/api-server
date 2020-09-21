import { Body, Controller, Delete, Get, Param, Post, HttpException, HttpStatus, UseInterceptors, ParseIntPipe, UseGuards, SetMetadata } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './user.entity'
import { UsersService } from './users.service'
import { RolesGuard, Roles, TransformInterceptor } from '../../core'

@Controller('users')
export class UsersController {
  constructor (private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(RolesGuard)
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
  @UseInterceptors(TransformInterceptor)
  findOne (
    // @Param('id', ParseIntPipe) id: string
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string
  ): Promise<User> {
    return this.usersService.findOne(id)
  }

  /**
 *  @Roles('admin')该装饰器尚未测试通过，当前并没有设置角色但依然可以删除成功
 */

  @Delete(':id')
  // @SetMetadata('roles', ['admin'])
  @Roles('admin')
  // @UseGuards(RolesGuard)
  remove (@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id)
  }
}
