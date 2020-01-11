import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";

import { PageToUser } from "./PageToUser";
import uuid from "uuid/v4";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @BeforeInsert()
  generateId = async () => {
    this.id = uuid();
  };

  @Column("varchar", { length: 255 })
  email: string;

  @Column("varchar", { length: 255, nullable: true })
  username: string | null;

  @Column("text", { nullable: true })
  googleId: string | null;

  /**
   * Used to refresh access tokens
   */
  @Column("int", { default: 0 })
  count: number;

  @CreateDateColumn()
  createdDate: Date;

  @OneToMany(
    () => PageToUser,
    pageToUser => pageToUser.user
  )
  pageToUser: PageToUser[];
}
