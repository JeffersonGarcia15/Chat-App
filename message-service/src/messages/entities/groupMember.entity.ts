import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Group } from "./group.entity";

@Entity()
export class GroupMember {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: "int" })
  GroupId: number;

  @Column({ type: "int" })
  UserId: number;

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

  // A Group can have many members
  // A User can be part of many groups
  @ManyToOne(() => Group, (group) => group.Members)
  @JoinColumn({ name: "GroupId" })
  Group: Group;
}
