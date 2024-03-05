import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  CreateMessageDto,
  FilterMessagesDto,
} from "src/messages/dtos/message.dto";

import { Message, MessageType } from "src/messages/entities/message.entity";
import { Between, FindOptionsWhere, Repository } from "typeorm";

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {}

  async createMessage(data: CreateMessageDto) {
    const message = this.messageRepository.create(data);
    return await this.messageRepository.save(message);
  }

  async findAll(params: FilterMessagesDto): Promise<Message[]> {
    // Destruction of the params object
    const { GroupId, Type, Limit, Offset, DeliveredAt } = params;

    // Declare an object to store the where clause
    const where: FindOptionsWhere<Message> = {};

    // Validate that the end date is not before the start date
    // Declare a variable to store the current date
    const currentDate: Date = new Date();

    // Validate that a GroupId was sent
    if (!GroupId) {
      throw new Error("A GroupId must be sent");
    }

    // Update the where clause with the GroupId
    where.GroupId = GroupId;

    // Validate that the Type is a valid MessageType
    if (Type) {
      if (!Object.values(MessageType).includes(Type)) {
        throw new Error("The message type is not valid");
      } else {
        where.Type = Type;
      }
    }

    if (DeliveredAt) {
      if (new Date(DeliveredAt) > currentDate) {
        throw new Error("The end date cannot be in the future");
      } else {
        // Update the where clause with the dates, and make it Between the start and end date
        where.DeliveredAt = Between(DeliveredAt, currentDate);
      }
    }

    // Return the found messages
    return await this.messageRepository.find({
      where,
      take: Limit,
      skip: Offset,
    });
  }
}
