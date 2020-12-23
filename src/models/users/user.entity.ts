import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ comment: '手机号', nullable: true, unique: true })
  phone_number: string;

  @Column({ comment: '国家码', nullable: true })
  country_code: string;

  @Column({ comment: '邮箱', nullable: true, unique: true })
  email: string;

  @Column({ comment: '用户名', nullable: true, unique: true })
  username: string;

  @Column({ comment: '密码' })
  password: string;

  @Column({ default: false, comment: '是否禁用' })
  isDisable: boolean;
}
