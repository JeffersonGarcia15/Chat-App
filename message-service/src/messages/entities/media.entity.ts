import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Message } from "./message.entity";

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: "int" })
  MessageId: number;

  @Column({ type: "enum", enum: ["image", "video", "audio", "file"] })
  Type: string;

  @Column({ type: "varchar" })
  Url: string;

  @Column({ type: "jsonb" })
  Metadata: object;

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

  // A Message is associated with a media
  @OneToOne(() => Message, (message) => message.Media, { nullable: true })
  Message: Message;
}
