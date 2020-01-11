import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";

import { Page } from "./Page";
import { User } from "./User";
import uuid = require("uuid");

/**
 * Type of `User` access on a `Page`
 *
 *      - `Creator` -> Full access    -> `Editor` + Can edit settings
 *      - `Editor`  -> Partial access -> `Reader` + Can edit content
 *      - `Reader`  -> Minimal access -> Can only read content
 */
export enum PageAccess {
  Creator = "Creator",
  Editor = "Editor",
  Reader = "Reader"
}

@Entity()
export class PageToUser extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  pageToUserId: string;

  @BeforeInsert()
  generateId = async () => {
    this.pageToUserId = uuid();
  };

  @ManyToOne(
    () => Page,
    page => page.pageToUser
  )
  page: Page;

  @ManyToOne(
    () => User,
    user => user.pageToUser
  )
  user: User;

  @Column("varchar")
  access: PageAccess;
}
