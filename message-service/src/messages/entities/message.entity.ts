import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Group } from "./group.entity";
import { Media } from "./media.entity";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: "text" })
  Content: string;

  @Column({ type: "int" })
  SenderId: number;

  @Column({ type: "int", nullable: true })
  ReceiverId: number;

  @Column({ type: "int", nullable: true })
  GroupId: number;

  @Column({ type: "enum", enum: ["edited", "deleted"] })
  Status: string;

  @Column({ type: "enum", enum: ["text", "image", "video", "audio", "file"] })
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
  // A User can have many messages(Users not part of this repo tho)

  @ManyToOne(() => Group, (group) => group.Messages)
  @JoinColumn({ name: "GroupId" })
  Group: Group;

  // A Media is associated with a message
  @OneToOne(() => Media, (media) => media.Message, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "MediaId" })
  Media: Media;
}
