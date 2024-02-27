import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class GroupMemberDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: "The ID of the group" })
  GroupId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: "The ID of the user" })
  UserId: number;
}
