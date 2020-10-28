// import { Injectable } from '@nestjs/common'
// import { InjectRepository } from '@nestjs/typeorm'
// import { Repository } from 'typeorm'

// @Injectable()
// export abstract class BaseService<T> {
//   constructor (
//     @InjectRepository(T)
//     private readonly dataRepository: Repository<T>
//   ) {}

//   create (dataDto: DataDto): Promise<T> {
//     const user = new T()
//     for (const key in dataDto) {
//       user[key] = dataDto[key]
//     }

//     return this.dataRepository.save(user)
//   }

//   findAll (): Promise<T[]> {
//     return this.dataRepository.find()
//   }

//   findOneById (id: string): Promise<T> {
//     return this.dataRepository.findOne(id)
//   }

//   findOne (account): Promise<T> {
//     return this.dataRepository.findOne(account)
//   }

//   remove (id: string): Promise<any> {
//     return this.dataRepository.delete(id)
//   }
// }
