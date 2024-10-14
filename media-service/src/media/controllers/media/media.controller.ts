import {
  Controller,
  Inject,
  Logger,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { ClientKafka, MessagePattern } from "@nestjs/microservices";
import { FileInterceptor } from "@nestjs/platform-express";
import { MediaService } from "src/media/services/media/media.service";
import { CustomFileValidationPipe } from "src/pipes/custom-file-validation.pipe";

@Controller("media")
export class MediaController {
  private logger = new Logger("MediaController");
  constructor(
    @Inject("KAFKA_SERVICE") private readonly clientKafka: ClientKafka,
    private readonly mediaService: MediaService,
  ) {}

  async onModuleInit() {
    // Making sure the client is connected to Kafka before starting the server
    await this.clientKafka.connect();
    this.logger.log("Kafka client, at the MessagesController, connected");
  }

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @UploadedFile(CustomFileValidationPipe) file: Express.Multer.File,
  ) {
    return await this.mediaService.uploadFile(file.originalname, file.buffer);
  }

  @MessagePattern("FileToProcess")
  async handleFileToProcess(data: {
    Id: number;
    File: string;
    FileName: string;
  }) {
    this.logger.log("FileToProcess event");

    // Destructure the data object
    const { Id, File, FileName } = data;

    // Decode Base64 string to a Buffer
    const file = Buffer.from(File, "base64");

    // Upload the file to S3
    const Content = await this.mediaService.uploadFile(FileName, file);

    // Emit the FileProcessed event
    this.clientKafka.emit(
      "FileProcessed",
      JSON.stringify({ Id, Content: Content.url }),
    );
  }
}
