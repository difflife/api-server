import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    nullable: true,
    unique: true
  })
  value: string;

  @Column()
  userId: string;

  // @Column()
  // clientId: string;

  @Column()
  ipAddress: string;

  @Column()
  expiresAt: Date;
}
