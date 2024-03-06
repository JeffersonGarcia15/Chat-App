import {
  Inject,
  Logger,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { WsExceptionFilter } from "src/filters/wsException.filter";
import { JoinChatDto } from "src/messages/dtos/joinChat.dto";
import {
  CreateMessageDto,
  FilterMessagesDto,
} from "src/messages/dtos/message.dto";
import { Message } from "src/messages/entities/message.entity";
import { GroupsService } from "src/messages/services/groups/groups.service";
import { MessagesService } from "src/messages/services/messages/messages.service";
@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
@UseFilters(new WsExceptionFilter())
@UsePipes(new ValidationPipe())
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  private logger = new Logger("MessagesGateway");

  constructor(
    @Inject("KAFKA_SERVICE") private clientKafka: ClientKafka,
    private messagesService: MessagesService,
    private groupService: GroupsService,
  ) {}

  async onModuleInit() {
    // Making sure the client is connected to Kafka before starting the server
    await this.clientKafka.connect();
    this.logger.log("Kafka client connected");
  }

  // This is the event that the client will emit to get the initial messages
  @SubscribeMessage("initialMessages")
  async getInitialMessages(@MessageBody() data: FilterMessagesDto) {
    // Get the initial messages from the database
    const messages = await this.messagesService.findAll(data);

    // Emit the messages to the WebSocket server
    this.server.to(String(data.GroupId)).emit("initialMessages", messages);
  }
  @SubscribeMessage("message")
  async sendMessage(@MessageBody() data: CreateMessageDto) {
    // Save the message to the database
    const savedMessage = await this.messagesService.createMessage(data);

    // Emit the message to the Kafka broker
    this.clientKafka.emit(
      "FileToProcess",
      JSON.stringify({ Id: savedMessage.Id, File: data.File }),
    );

    // Emit the message to the WebSocket server. We don't send just data because this one doesn't have an id.
    this.server.to(String(data.GroupId)).emit("message", savedMessage);
  }

  @SubscribeMessage("join")
  async joinGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinChatDto,
  ) {
    // Handle the room creation/retrieval and joining
    const groupChat = await this.groupService.joinChat(data);
    client.join(String(groupChat.Id));
    console.log(`User joined group ${String(groupChat.Id)}`);
  }

  async sendFileMessage(message: Message) {
    this.server.to(String(message.GroupId)).emit("message", message);
  }
}
