import { ApiProperty, PartialType } from "@nestjs/swagger";
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from "class-validator";
import { MessageStatus, MessageType } from "../entities/message.entity";

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "The content of the message" })
  Content: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty({ description: "The ID of the sender" })
  SenderId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: "The ID of the receiver" })
  ReceiverId?: number; // Optional, assuming it can be null for group messages

  @IsNumber()
  @IsPositive()
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

  @IsOptional()
  @ApiProperty({
    type: "file",
  })
  File?: string | ArrayBuffer | Buffer;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: "The file name",
    type: "string",
  })
  FileName?: string;

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

export class FilterMessagesDto {
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: "The ID of the group",
    required: false,
  })
  GroupId?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: "The type of the message",
    required: false,
  })
  Type?: MessageType;

  @IsOptional()
  @IsNumber({ allowNaN: false }, { message: "The limit must be a number" })
  @IsPositive()
  @ApiProperty({ description: "The limit of messages to return" })
  Limit?: number;

  @IsOptional()
  @IsNumber({ allowNaN: false }, { message: "The offset must be a number" })
  @Min(0)
  @ApiProperty({ description: "The offset of messages to return" })
  Offset?: number;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: "The time the message was delivered",
    required: false,
    type: "string",
    format: "date-time",
  })
  DeliveredAt?: Date;
}
