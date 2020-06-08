import { GraphQLDefinitionsFactory } from '@nestjs/graphql'
import { join } from 'path'

const definitionsFactory = new GraphQLDefinitionsFactory()
definitionsFactory.generate({ // 配置编写GraphQL SDL模式定义文件路径
  typePaths: ['./src/**/*.graphql'], // 从抽象语法树（AST）自动生成 TypeScript定义
  path: join(process.cwd(), 'src/graphql.schema.ts'), // 生成graphql.schema目录
  outputAs: 'class', // 默认情况下，所有生成的TypeScript类型都创建为接口。要生成类，请指定outputAs值为的属性'class'
  watch: true // .graphql 文件更改时自动生成graphql.schema文件
})
