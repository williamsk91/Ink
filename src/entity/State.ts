import { Entity, Column, PrimaryColumn, BaseEntity, OneToOne } from "typeorm";
import { Page } from "./Page";

@Entity()
export class State extends BaseEntity {
  @PrimaryColumn()
  id: number;

  // the page path
  @Column("varchar")
  content: any;

  @OneToOne(
    () => Page,
    page => page.state
  )
  page: Page;
}
