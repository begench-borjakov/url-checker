import { ArrayNotEmpty, IsArray, IsString, IsUrl } from 'class-validator';

export class CreateJobDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsUrl(
    {
      protocols: ['http', 'https'],
      require_protocol: true,
    },
    { each: true },
  )
  urls!: string[];
}
