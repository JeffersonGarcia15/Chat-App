import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class CustomFileValidationPipe implements PipeTransform {
  // Validating the MessageType field from the Message entity
  private readonly allowedMimeTypes = {
    image: ["image/png", "image/jpg", "image/jpeg"],
    video: ["video/mp4", "video/mpeg", "video/mov", "video/quicktime"],
    audio: ["audio/mpeg", "audio/mp3"],
    file: ["application/pdf", "application/msword", "application/vnd.ms-excel"],
  };

  // The maximum file size in bytes, 8MB just like Discord
  private readonly MAX_FILE_SIZE = 8000000;

  // Then number of bytes in a megabyte
  private readonly BYTES_IN_A_MEGABYTE = 1000000;

  transform(value: Express.Multer.File) {
    // File size validation
    if (value && value.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size exceeds the maximum limit of ${this.MAX_FILE_SIZE / this.BYTES_IN_A_MEGABYTE} MB.`,
      );
    }

    // File type validation
    if (value && !this.isValidMimeType(value.mimetype)) {
      throw new BadRequestException("Invalid file type.");
    }
    return value;
  }

  private isValidMimeType(mimeType: string): boolean {
    // Instead of having a string[][] through the Object.values method, we can use the flat method to flatten the array
    // so that it is now a string[], allowing us to use .includes()
    return Object.values(this.allowedMimeTypes).flat().includes(mimeType);
  }
}
