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
@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  private logger = new Logger("MessagesGateway");

  constructor(@Inject("KAFKA_SERVICE") private clientKafka: ClientKafka) {}

  async onModuleInit() {
    // Making sure the client is connected to Kafka before starting the server
    await this.clientKafka.connect();
    this.logger.log("Kafka client connected");
  }

  @SubscribeMessage("message")
  sendMessage(@MessageBody() data: CreateMessageDto) {
    this.clientKafka.emit("FileToProcess", JSON.stringify({ File: data.File }));

    this.server.to(String(data.GroupId)).emit("message", data);
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
