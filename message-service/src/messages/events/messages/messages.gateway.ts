import { Inject, Logger } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { CreateMessageDto } from "src/messages/dtos/message.dto";
import { MessagesService } from "src/messages/services/messages/messages.service";
@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  private logger = new Logger("MessagesGateway");

  constructor(
    @Inject("KAFKA_SERVICE") private clientKafka: ClientKafka,
    private messagesService: MessagesService,
  ) {}

  async onModuleInit() {
    // Making sure the client is connected to Kafka before starting the server
    await this.clientKafka.connect();
    this.logger.log("Kafka client connected");
  }

  @SubscribeMessage("message")
  async sendMessage(@MessageBody() data: CreateMessageDto) {
    // Save the message to the database
    const savedMessage = await this.messagesService.createMessage(data);

    // Emit the message to the Kafka broker
    this.clientKafka.emit("FileToProcess", JSON.stringify({ File: data.File }));

    // Emit the message to the WebSocket server. We don't send just data because this one doesn't have an id.
    this.server.to(String(data.GroupId)).emit("message", savedMessage);
  }

  @SubscribeMessage("join")
  joinGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { GroupId: number },
  ) {
    client.join(String(data.GroupId));
    console.log(`User joined group ${String(data.GroupId)}`);
  }
}
