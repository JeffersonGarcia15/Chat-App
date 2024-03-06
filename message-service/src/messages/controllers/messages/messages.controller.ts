import { Controller, Inject, Logger } from "@nestjs/common";
import { ClientKafka, MessagePattern } from "@nestjs/microservices";
import { UpdateMessageDto } from "src/messages/dtos/message.dto";
import { MessagesService } from "src/messages/services/messages/messages.service";

@Controller("messages")
export class MessagesController {
  private logger = new Logger("MessagesController");
  constructor(
    @Inject("KAFKA_SERVICE") private readonly clientKafka: ClientKafka,
    private readonly messagesService: MessagesService,
  ) {}

  async onModuleInit() {
    // Making sure the client is connected to Kafka before starting the server
    await this.clientKafka.connect();
    this.logger.log("Kafka client, at the MessagesController, connected");
  }

  // This is the event that the Media Service will emit when the File is uploaded and processed
  @MessagePattern("FileProcessed")
  handleImageProcessed(Id: number, data: UpdateMessageDto) {
    this.logger.log("FileProcessed event");
    this.messagesService.update(Id, data);
  }
}
