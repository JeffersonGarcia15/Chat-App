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

export enum MessageStatus {
  Edited = "edited",
  Deleted = "deleted",
}

export enum MessageType {
  Text = "text",
  Image = "image",
  Video = "video",
  Audio = "audio",
  File = "file",
}

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: "text" })
  Content: string;

  @Column({ type: "int" })
  SenderId: number;

  @Column({ type: "int", nullable: true })
  GroupId: number;

  @Column({ type: "enum", enum: MessageStatus, nullable: true })
  Status: string;

  @Column({
    type: "enum",
    enum: MessageType,
    default: "text",
  })
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

  @Column({ type: "date", nullable: true })
  SentAt: Date;

  @Column({ type: "date", nullable: true })
  DeliveredAt: Date;

  @Column({ type: "date", nullable: true })
  ReadAt: Date;

  // A Group can have many messages
  // A User can have many messages(Users not part of this repo tho)

  @ManyToOne(() => Group, (group) => group.Messages)
  @JoinColumn({ name: "GroupId" })
  Group: Group;
}
