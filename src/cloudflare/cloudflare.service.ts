import { Inject, Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import * as AWS from 'aws-sdk'
import { appEnv } from 'src/app.env'
import { Readable } from 'stream'

@Injectable()
export class CloudflareService implements OnModuleInit {
  private readonly r2: AWS.S3
  constructor(@Inject(appEnv.KEY) private readonly env: ConfigType<typeof appEnv>) {
    this.r2 = new AWS.S3({
      region: 'auto',
      endpoint: `https://${this.env.cfAccountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: this.env.r2AccessKey,
        secretAccessKey: this.env.r2SecretKey,
      },
    })
  }
  async onModuleInit() {
    console.log(this.r2)
  }

  async uploadVideo(id: string, file: any): Promise<string> {
    console.log(file)

    const command: AWS.S3.Types.PutObjectRequest = {
      Bucket: this.env.r2bucketName,
      Key: id,
      ContentType: file.mimetype,
      Body: Readable.from(file.buffer),
    }

    try {
      const result = await this.r2.upload(command).promise()
      console.log({ result })

      return result.Location
    } catch (e) {
      console.warn(e)
      throw new InternalServerErrorException(e)
    }
  }

  async downloadVideo(id: string): Promise<Buffer> {
    const command = {
      Bucket: this.env.r2bucketName,
      Key: id,
    }

    try {
      const { Body } = await this.r2.getObject(command).promise()
      console.log({ Body })

      return Body as Buffer
    } catch (err) {
      console.log(err)
      throw new InternalServerErrorException(err)
    }
  }
}
