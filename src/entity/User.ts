import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn
} from "typeorm";
import uuid from "uuid/v4";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { length: 255 })
  email: string;

  @Column("varchar", { length: 255, nullable: true })
  username: string | null;

  @Column("text", { nullable: true })
  googleId: string | null;

  @CreateDateColumn()
  createdDate: Date;

  @BeforeInsert()
  generateId = async () => {
    this.id = uuid();
  };
}
