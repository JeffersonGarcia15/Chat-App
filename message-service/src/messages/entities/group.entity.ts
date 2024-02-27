import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Message } from "./message.entity";
import { GroupMember } from "./groupMember.entity";

enum GroupType {
  Group = "group",
  Dm = "dm",
} // could be expanded for private/public groups

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: "varchar", length: 100 })
  Name: string;

  @Column({ type: "varchar", length: 200, nullable: true })
  Description: string;

  @Column({ type: "enum", enum: GroupType, default: GroupType.Dm })
  Type: string;

  @CreateDateColumn({
    name: "CreatedAt",
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  CreatedAt: Date;

  @UpdateDateColumn({
    name: "UpdatedAt",
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  UpdatedAt: Date;

  // A Group can have many messages
  // A Group can have many members

  @OneToMany(() => Message, (message) => message.Group, { onDelete: "CASCADE" })
  Messages: Message[];

  // A Group can have many members
  @OneToMany(() => GroupMember, (groupMember) => groupMember.Group, {
    onDelete: "CASCADE",
  })
  Members: GroupMember[];
}
