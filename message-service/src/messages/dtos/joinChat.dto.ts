import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class JoinChatDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: "The id of the sender" })
  SenderId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: "The id of the receiver" })
  ReceiverId?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: "The id of the group" })
  GroupId?: number;
}
