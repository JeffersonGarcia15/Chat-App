import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ["kafka:9092"],
      },
      consumer: {
        groupId: "media-service-group",
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3001);
  console.log("Media service is running on port 3001");
}
bootstrap();
