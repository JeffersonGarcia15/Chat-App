import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CustomFileValidationPipe } from "src/pipes/custom-file-validation.pipe";

@Controller("media")
export class MediaController {
  @Post()
  @UseInterceptors(FileInterceptor("file"))
  uploadFile(
    @UploadedFile(CustomFileValidationPipe) file: Express.Multer.File,
  ) {
    console.log(file);
  }
}
