import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common'
import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer'
// import * as Joi from 'joi'

/**
 * 管道有两个典型的用例：
 * 转换：将输入数据转换为所需的形式（例如，从字符串到整数）
 * 验证：评估输入数据，如果有效，只需将其原样传递即可；否则，当数据不正确时抛出异常
 */

// // 对象架构验证
// @Injectable()
// export class JoiValidationPipe implements PipeTransform {
//   constructor (private schema: Joi.object.Schema) {}

//   transform (value: any, metadata: ArgumentMetadata) {
//     const { error } = this.schema.validate(value)
//     if (error) {
//       throw new BadRequestException('Validation failed')
//     }
//     return value
//   }
// }

// 类验证
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform (value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value
    }
    const object = plainToClass(metatype, value)
    const errors = await validate(object)

    if (errors.length > 0) {
      const messageArray = []
      errors.forEach((item) => {
        messageArray.push(Object.values(item.constraints))
      })
      const message = messageArray.join(';')
      throw new BadRequestException(message)
    }
    return value
  }

  private toValidate (metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object]
    return !types.includes(metatype)
  }
}
