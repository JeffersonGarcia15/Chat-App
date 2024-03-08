import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import config from "src/config";

@Injectable()
export class MediaService {
  constructor(
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
  ) {}
  private readonly s3Client = new S3Client({
    region: this.configService.region,
  });

  async uploadFile(fileName: string, file: Buffer) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.bucket,
        Key: fileName,
        Body: file,
      }),
    );
  }
}
