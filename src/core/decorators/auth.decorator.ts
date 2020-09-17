// import { applyDecorators } from '@nestjs/common'

// // Nest提供了一种辅助方法来组成多个装饰器。例如，假设您要将与身份验证相关的所有装饰器组合到一个装饰器中
// export function Auth (...roles: Role[]) {
//   return applyDecorators(
//     SetMetadata('roles', roles),
//     UseGuards(AuthGuard, RolesGuard),
//     ApiBearerAuth(),
//     ApiUnauthorizedResponse({ description: 'Unauthorized"' })
//   )
// }
