import { ApiProperty, PartialType } from "@nestjs/swagger";
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

enum MessageStatus {
  Edited = "edited",
  Deleted = "deleted",
}

enum MessageType {
  Text = "text",
  Image = "image",
  Video = "video",
  Audio = "audio",
  File = "file",
}

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "The content of the message" })
  Content: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "The ID of the sender" })
  SenderId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "The ID of the receiver" })
  ReceiverId?: number; // Optional, assuming it can be null for group messages

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "The ID of the group" })
  GroupId?: number; // Optional, assuming it can be null for direct messages (DMs)

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "The status of the message" })
  Status?: MessageStatus;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "The type of the message" })
  Type: MessageType;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: "file",
  })
  File?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: "The time the message was sent",
    required: false,
    type: "string",
    format: "date-time",
  })
  SentAt?: Date;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: "The time the message was delivered",
    required: false,
    type: "string",
    format: "date-time",
  })
  DeliveredAt?: Date;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: "The time the message was read",
    required: false,
    type: "string",
    format: "date-time",
  })
  ReadAt?: Date;
}

export class UpdateMessageDto extends PartialType(CreateMessageDto) {}
