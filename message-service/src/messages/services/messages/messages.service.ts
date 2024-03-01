import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateMessageDto } from "src/messages/dtos/message.dto";

import { Message } from "src/messages/entities/message.entity";
import { Repository } from "typeorm";

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {}

  async createMessage(data: CreateMessageDto) {
    const message = this.messageRepository.create(data);
    return await this.messageRepository.save(message);
  }
}
