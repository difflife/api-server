import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ comment: '手机号' })
  phone_number: string;

  @Column({ comment: '手机号' })
  email: string;

  @Column({ comment: '手机号' })
  username: string;

  @Column({
    nullable: true,
    unique: true,
    comment: '密码'
  })
  password: string;

  @Column({
    default: false,
    comment: '是否禁用'
  })
  isDisable: boolean;
}
