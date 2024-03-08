import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule } from "@nestjs/config";
import { MediaController } from "./media/controllers/media/media.controller";
import { MediaService } from "./media/services/media/media.service";
import { MediaModule } from "./media/media.module";
import { environments } from "./environments";
import config from "./config";
import * as Joi from "joi";

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
            groupId: "media-service-group",
          },
        },
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: environments[process.env.NODE_ENV] || ".env",
      load: [config],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid("dev", "prod", "stag").default("dev"),
        AWS_S3_REGION: Joi.string().required(),
        AWS_S3_BUCKET: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        UPLOAD_THROTTLE_TTL: Joi.number().default(60000),
        UPLOAD_THROTTLE_LIMIT: Joi.number().default(5),
      }),
    }),
    MediaModule,
  ],
  controllers: [AppController, MediaController],
  providers: [AppService, MediaService],
})
export class AppModule {}
