import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

enum GroupType {
  Group = "group",
  Dm = "dm",
} // could be expanded for private/public groups

export class GroupDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "The name of the group" })
  Name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "The description of the group" })
  Description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "The type of the group" })
  Type: GroupType;
}

export class UpdateGroupDto extends PartialType(GroupDto) {}
