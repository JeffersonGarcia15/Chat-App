import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MessagesModule } from "./messages/services/messages/messages.module";
import { environments } from "./environments";
import config from "./config";

@Module({
  imports: [
    MessagesModule,
    ConfigModule.forRoot({
      envFilePath: environments[process.env.NODE_ENV] || ".env",
      isGlobal: true,
      load: [config],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid("dev", "prod", "stag").default("dev"),
        PORT: Joi.number().default(5432),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
