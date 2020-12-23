import { registerDecorator, ValidationOptions, ValidationArguments, equals, isPhoneNumber, isEmail } from 'class-validator'
import { prop, props, isNil } from 'ramda'
import { AccountType } from '../../graphql.schema'

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

export function IsValidAccount (validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'IsValidAccount',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate (value: any, args: ValidationArguments): boolean {
          const [type, phoneNumber, countryCode, email] = props(['type', 'phoneNumber', 'countryCode', 'email'], args.object)

          if (AccountType.email === type) {
            if (isNil(email)) {
              throw new Error('邮箱不能为空')
            } else if (isEmail(email)) {
              return true
            } else {
              throw new Error('邮箱无效')
            }
          }

          if (isNil(countryCode)) {
            throw new Error('国家代码不能为空')
          } else if (isNil(phoneNumber)) {
            throw new Error('手机号不能为空')
          } else if (isPhoneNumber(phoneNumber, countryCode)) {
            return true
          } else {
            throw new Error('手机号无效')
          }
        }
      }
    })
  }
}
