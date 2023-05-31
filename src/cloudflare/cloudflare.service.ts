import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import * as AWS from 'aws-sdk'
import { Response } from 'express'
import { appEnv } from 'src/app.env'
import { Readable } from 'stream'

@Injectable()
export class CloudflareService {
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

  async downloadVideo(id: string, res: Response) {
    const command = { Bucket: this.env.r2bucketName, Key: id }

    try {
      const stream = this.r2.getObject(command).createReadStream().pipe(res)
      stream.on('error', error => {
        console.error(error)
        res.status(500).end()
      })

      return stream
    } catch (err) {
      console.log(err)
      throw new InternalServerErrorException(err)
    }
  }

  async test() {
    return
  }
}
