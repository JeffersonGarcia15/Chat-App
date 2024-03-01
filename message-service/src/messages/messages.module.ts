import { Module } from "@nestjs/common";
import { MessagesGateway } from "./events/messages/messages.gateway";
import { SharedModule } from "src/shared/shared.module";
import { MessagesService } from "./services/messages/messages.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "./entities/message.entity";
import { Group } from "./entities/group.entity";
import { GroupMember } from "./entities/groupMember.entity";

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([Message, Group, GroupMember]),
  ],
  providers: [MessagesGateway, MessagesService],
  exports: [MessagesService, TypeOrmModule],
})
export class MessagesModule {}
