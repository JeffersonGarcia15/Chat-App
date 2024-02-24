import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

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
    name: "created_at",
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  CreatedAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  UpdatedAt: Date;
}
