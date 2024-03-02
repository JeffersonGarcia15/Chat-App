import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JoinChatDto } from "src/messages/dtos/joinChat.dto";
import { Group } from "src/messages/entities/group.entity";
import { GroupMember } from "src/messages/entities/groupMember.entity";
import { createDmIdentifier } from "src/utils/createDmIdentifier";
import { Repository } from "typeorm";

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group) private groupRepository: Repository<Group>,
    @InjectRepository(GroupMember)
    private groupMemberRepository: Repository<GroupMember>,
  ) {}

  async joinChat(joinChatDto: JoinChatDto) {
    const { SenderId, ReceiverId, GroupId } = joinChatDto;

    let groupChat: Group;

    // Handle the logic for Dms
    if (ReceiverId) {
      // Obtain the unique identifier for the DM by sorting the IDs and joining them with an underscore
      const dmIdentifier = createDmIdentifier(SenderId, ReceiverId);

      // Check if the DM (Group) already exists
      groupChat = await this.groupRepository.findOne({
        where: { Identifier: dmIdentifier, Type: "dm" },
      });

      // If it doesn't exist, create it
      if (!groupChat) {
        groupChat = await this.groupRepository.save({
          Identifier: dmIdentifier,
          Type: "dm",
        });
      }
    } else if (GroupId) {
      // If the chat is a group chat, just get the group
      groupChat = await this.groupRepository.findOneBy({ Id: GroupId });

      // If the group doesn't exist, throw an error
      // Keep in mind that a group chat is created BEFORE joining it, which is different from DMs
      if (!groupChat) {
        throw new Error("Group not found");
      }
    } else {
      throw new Error("Invalid join chat request");
    }

    // Check if a member is already a member of this group(make use of the groupMemberRepository)
    // Remember, just because we found the group it doesn't mean that the SenderId(UserId) is a member
    const isMember = await this.groupMemberRepository.findOne({
      where: { UserId: SenderId, GroupId: groupChat.Id },
    });

    // If the user is not a member, add them
    if (!isMember) {
      await this.groupMemberRepository.save({
        UserId: SenderId,
        GroupId: groupChat.Id,
      });
    }

    // Return the group chat details
    return groupChat;
  }
}
