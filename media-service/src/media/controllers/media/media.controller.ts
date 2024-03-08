import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { MediaService } from "src/media/services/media/media.service";
import { CustomFileValidationPipe } from "src/pipes/custom-file-validation.pipe";

@Controller("media")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @UploadedFile(CustomFileValidationPipe) file: Express.Multer.File,
  ) {
    await this.mediaService.uploadFile(file.originalname, file.buffer);
  }
}
