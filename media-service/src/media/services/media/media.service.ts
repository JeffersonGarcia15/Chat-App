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

  async uploadFile(originalFileName: string, file: Buffer) {
    // Generating a unique file name. This is avoid overwriting files with the same name
    const fileName = `${Date.now()}-${originalFileName}`;
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.bucket,
        Key: fileName,
        Body: file,
      }),
    );

    return {
      url: `https://${this.configService.bucket}.s3.amazonaws.com/${fileName}`,
    };
  }
}
