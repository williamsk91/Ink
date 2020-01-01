import {
  Entity,
  Column,
  BaseEntity,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert
} from "typeorm";
import uuid from "uuid/v4";

import { State } from "./State";

@Entity()
export class Page extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { length: 255, nullable: true })
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

  @BeforeInsert()
  generateId = async () => {
    this.id = uuid();
  };
}
