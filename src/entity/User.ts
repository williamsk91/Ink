import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  BaseEntity
} from "typeorm";
import uuidv4 from "uuid/v4";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryColumn("uuid")
  id: string;

  @Column("varchar", { length: 255 })
  email: string;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
