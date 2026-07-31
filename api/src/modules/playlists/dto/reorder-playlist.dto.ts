import { IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReorderPlaylistDto {
  @ApiProperty({
    description: 'Array of track IDs in the new desired order',
    type: [String],
    example: ['uuid-1', 'uuid-2', 'uuid-3'],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  trackIds: string[];
}
