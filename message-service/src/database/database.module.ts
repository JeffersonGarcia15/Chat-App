import { Module, Global } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Client } from "pg";

import config from "src/config";
import { Group } from "src/messages/entities/group.entity";
import { GroupMember } from "src/messages/entities/groupMember.entity";
import { Message } from "src/messages/entities/message.entity";

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { username, host, name, password, port } = configService.database;
        return {
          type: "postgres",
          host,
          port: Number(port),
          username,
          password,
          database: name,
          autoLoadEntities: true,
          synchronize: false, // DO NOT USE IN PRODUCTION
          entities: [Message, Group, GroupMember],
        };
      },
    }),
  ],
  providers: [
    {
      provide: "PG",
      useFactory: (configService: ConfigType<typeof config>) => {
        const { username, host, name, password, port } = configService.database;
        const client = new Client({
          host,
          port: Number(port),
          user: username,
          password,
          database: name,
        });
        client.connect();
        return client;
      },
      inject: [config.KEY],
    },
  ],
  exports: ["PG", TypeOrmModule],
})
export class DatabaseModule {}
