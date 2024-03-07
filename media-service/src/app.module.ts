import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule } from "@nestjs/config";
import { MediaController } from "./controllers/media/media.controller";
import { MediaService } from "./services/media/media.service";

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
            groupId: "notification-service-group",
          },
        },
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
  ],
  controllers: [AppController, MediaController],
  providers: [AppService, MediaService],
})
export class AppModule {}
