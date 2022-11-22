import { Module } from '@nestjs/common'
import { VideosService } from './videos.service'
import { VideosController } from './videos.controller'
import { VideoEntity } from './entities/video.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ValidatorService } from 'shared/services/validator.service'
import { AwsS3Service } from 'shared/services/aws-s3.service'
import { AppConfigService } from 'shared/services/app-config.service'
import { GeneratorService } from 'shared/services/generator.service'
import { ViewEntity } from 'modules/views/entities/view.entity'

@Module({
  imports: [TypeOrmModule.forFeature([VideoEntity, ViewEntity])],
  controllers: [VideosController],
  providers: [VideosService, AwsS3Service, ValidatorService, AppConfigService, GeneratorService],
})
export class VideosModule {}
