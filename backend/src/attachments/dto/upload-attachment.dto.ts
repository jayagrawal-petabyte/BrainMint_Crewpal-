import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UploadAttachmentDto {
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Description cannot exceed 255 characters' })
  description?: string;
}
