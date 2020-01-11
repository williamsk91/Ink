import {
  Entity,
  Column,
  BaseEntity,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany
} from "typeorm";
import uuid from "uuid/v4";

import { State } from "./State";
import { PageToUser } from "./PageToUser";

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
}
