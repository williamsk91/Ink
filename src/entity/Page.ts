import {
  Entity,
  Column,
  BaseEntity,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

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
}
