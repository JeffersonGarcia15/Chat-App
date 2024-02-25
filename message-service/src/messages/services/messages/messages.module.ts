import { Module } from "@nestjs/common";
import { MessagesGateway } from "./messages.gateway";
import { SharedModule } from "src/shared/shared.module";

@Module({
  imports: [SharedModule],
  providers: [MessagesGateway],
})
export class MessagesModule {}
