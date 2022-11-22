import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UpdateVideoDto } from './dto'
import { VideoEntity } from './entities/video.entity'
import { ValidatorService } from 'shared/services/validator.service'
import { AwsS3Service } from 'shared/services/aws-s3.service'
import { UserEntity } from 'modules/users/entities'
import { ViewEntity } from 'modules/views/entities/view.entity'

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(VideoEntity)
    private videosRepository: Repository<VideoEntity>,
    @InjectRepository(ViewEntity)
    private viewsRepository: Repository<ViewEntity>,
    private validatorService: ValidatorService,
    private awsS3Service: AwsS3Service
  ) {}

  async create(file: Express.Multer.File, user: UserEntity): Promise<VideoEntity> {
    const video = this.videosRepository.create()
    video.user = user

    if (file) {
      const url = await this.awsS3Service.uploadFile(file)
      video.url = url
    }

    return this.videosRepository.save(video)
  }

  async findAll(): Promise<VideoEntity[]> {
    const videos = await this.videosRepository.find()

    return videos
  }

  async getViews(video: VideoEntity): Promise<ViewEntity[]> {
    return await this.viewsRepository.find({ where: { videoId: video.id } })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getComments(_video: VideoEntity): Promise<any> {
    return [
      {
        id: 1,
        content: "I'm a comment",
        likedCount: 1,
        children: [],
      },
      {
        id: 2,
        content: "I'm a comment 2",
        likedCount: 2,
        children: [
          {
            id: 4,
            content: "I'm a reply comment",
            likedCount: 4,
            children: [{ id: 6, content: "I'm a reply of reply comment", likedCount: 1, children: [] }],
          },
          { id: 5, content: "I'm a reply comment2", likedCount: 1, children: [] },
        ],
      },
      {
        id: 3,
        content: "I'm a comment 3",
        likedCount: 3,
        children: [],
      },
    ]
  }

  async findOneById(id: number): Promise<VideoEntity> | null {
    const video = await this.videosRepository.findOneBy({ id })

    return video
  }

  update(id: number, updateVideoDto: UpdateVideoDto) {
    return `This action updates a #${id} video`
  }

  remove(id: number) {
    return `This action removes a #${id} video`
  }
}
