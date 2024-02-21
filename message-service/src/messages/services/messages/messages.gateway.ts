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

  @SubscribeMessage("message")
  sendMessage(@MessageBody() data: CreateMessageDto) {
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
