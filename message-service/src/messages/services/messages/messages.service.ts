import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  CreateMessageDto,
  FilterMessagesDto,
  UpdateMessageDto,
} from "src/messages/dtos/message.dto";

import { Message, MessageType } from "src/messages/entities/message.entity";
import { MessagesGateway } from "src/messages/events/messages/messages.gateway";
import { Between, FindOptionsWhere, Repository } from "typeorm";

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    private messagesGateway: MessagesGateway,
  ) {}

  async createMessage(data: CreateMessageDto) {
    const message = this.messageRepository.create(data);
    return await this.messageRepository.save(message);
  }

  async findOne(Id: number): Promise<Message> {
    // This will eventually be expanded to include the user's groups.
    const message = await this.messageRepository.findOne({ where: { Id } });
    return message;
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
      throw new BadRequestException("A GroupId must be sent");
    }

    // Update the where clause with the GroupId
    where.GroupId = GroupId;

    // Validate that the Type is a valid MessageType
    if (Type) {
      if (!Object.values(MessageType).includes(Type)) {
        throw new BadRequestException("The message type is not valid");
      } else {
        where.Type = Type;
      }
    }

    if (DeliveredAt) {
      if (new Date(DeliveredAt) > currentDate) {
        throw new BadRequestException("The end date cannot be in the future");
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

  async update(Id: number, data: UpdateMessageDto) {
    const dbMessage = await this.findOne(Id);
    if (!dbMessage) {
      throw new NotFoundException(`Message with Id ${Id} not found`);
    }
    this.messageRepository.merge(dbMessage, data);

    const message = await this.messageRepository.save(dbMessage);

    // Emit the message to the WebSocket server
    this.messagesGateway.sendFileMessage(message);
  }
}
