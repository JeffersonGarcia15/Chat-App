import { Global, Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: "KAFKA_SERVICE",
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ["kafka:9092"],
          },
          consumer: {
            groupId: "message-service-group",
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule], // Make ClientsModule available for import by other modules such as the AppModule, MessageModule, and GroupModule if needed.
})
export class SharedModule {}
