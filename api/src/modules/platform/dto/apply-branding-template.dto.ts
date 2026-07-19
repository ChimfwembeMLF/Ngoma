import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, IsUUID } from 'class-validator';

export class ApplyBrandingTemplateDto {
  @ApiProperty({ example: 'ngoma-hero' })
  @IsString()
  templateId!: string;

  @ApiProperty({ enum: ['starter', 'saved'] })
  @IsIn(['starter', 'saved'])
  source!: 'starter' | 'saved';
}

export class SaveBrandingTemplateDto {
  @ApiProperty({ example: 'Summer Launch', maxLength: 80 })
  @IsString()
  name!: string;
}

export class DeleteBrandingTemplateParams {
  @IsUUID()
  id!: string;
}
