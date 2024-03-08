import { Module } from "@nestjs/common";
import { MediaService } from "./services/media/media.service";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { ConfigType } from "@nestjs/config";
import config from "src/config";
import { APP_GUARD } from "@nestjs/core";

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { ttl, limit } = configService.throttler;
        return {
          throttlers: [
            {
              ttl: Number(ttl),
              limit: Number(limit),
            },
          ],
        };
      },
    }),
  ],
  providers: [
    MediaService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [MediaService],
})
export class MediaModule {}
