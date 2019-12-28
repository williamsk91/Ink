import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  BaseEntity,
  OneToOne,
  JoinColumn
} from "typeorm";
import uuidv4 from "uuid/v4";

import { State } from "./State";

@Entity()
export class Page extends BaseEntity {
  @PrimaryColumn("uuid")
  id: string;

  @Column("varchar", { length: 255 })
  title: string;

  // the page path
  @Column("varchar", { array: true })
  path: string[];

  @OneToOne(
    () => State,
    state => state.page
  )
  @JoinColumn()
  state: State;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
