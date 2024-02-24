import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: "int" })
  MessageId: number;

  @Column({ type: "enum", enum: ["image", "video", "audio", "file"] })
  Type: string;

  @Column({ type: "string" })
  Url: string;

  @Column({ type: "jsonb" })
  Metadata: object;

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
