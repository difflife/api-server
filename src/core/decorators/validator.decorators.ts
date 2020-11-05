import { registerDecorator, ValidationOptions, ValidationArguments, equals } from 'class-validator'
import { prop } from 'ramda'

export function IsEquals (property: string[] | string, validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'IsEquals',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate (value: any, args: ValidationArguments): boolean {
          // 拿到要比较的属性名或者路径 参考`lodash#get`方法
          const [comparativePropertyName] = args.constraints
          // 拿到要比较的属性值
          const comparativeValue = prop(comparativePropertyName, args.object)
          // 返回false 验证失败
          return equals(value, comparativeValue)
        }
      }
    })
  }
}
