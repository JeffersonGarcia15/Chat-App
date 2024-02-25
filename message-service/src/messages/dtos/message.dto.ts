import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

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
  @IsNotEmpty()
  @ApiProperty({ description: "The status of the message" })
  Status: MessageStatus;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "The type of the message" })
  Type: MessageType;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: "file",
  })
  File: string;
}

export class UpdateMessageDto extends PartialType(CreateMessageDto) {}
