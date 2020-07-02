```bash
# prisma introspect
根据数据库生产prisma数据模型，添加--experimental-reintrospection参数，
避免使用@map、@@map重命名之后，再次运行introspect被覆盖问题
@@map: 在模型和枚举上  @map: 关于字段和枚举值
详情：https://github.com/prisma/prisma/issues/2829
```
