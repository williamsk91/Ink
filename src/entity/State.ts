import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";

import { Page } from "./Page";

@Entity()
export class State extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // the page path
  @Column("varchar")
  content: string;

  @CreateDateColumn()
  createdDate: Date;

  @OneToOne(
    () => Page,
    page => page.state,
    { cascade: true }
  )
  page: Page;
}
