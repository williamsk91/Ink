import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

import { PageToUser } from "./PageToUser";
import { State } from "./State";
import uuid from "uuid/v4";

@Entity()
export class Page extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @BeforeInsert()
  generateId = async () => {
    this.id = uuid();
  };

  @Column("varchar", { length: 255 })
  title: string;

  // the page path
  @Column("varchar", { array: true })
  path: string[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @OneToOne(
    () => State,
    state => state.page
  )
  @JoinColumn()
  state: State;

  @OneToMany(
    () => PageToUser,
    pageToUser => pageToUser.page,
    { cascade: true }
  )
  pageToUser: PageToUser[];

  @Column("boolean", { nullable: false, default: false })
  deleted: boolean;
}
