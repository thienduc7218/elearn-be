import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import * as AWS from 'aws-sdk'
import { Response } from 'express'
import { appEnv } from 'src/app.env'

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
      signatureVersion: 'v4',
    })
  }

  // async uploadVideo(id: string, file: any): Promise<string> {
  //   console.log(file)

  //   const command: AWS.S3.Types.PutObjectRequest = {
  //     Bucket: this.env.r2bucketName,
  //     Key: id,
  //     ContentType: file.mimetype,
  //     Body: Readable.from(file.buffer),
  //   }

  //   try {
  //     const result = await this.r2.upload(command).promise()
  //     console.log({ result })

  //     return result.Location
  //   } catch (e) {
  //     console.warn(e)
  //     throw new InternalServerErrorException(e)
  //   }
  // }

  async uploadVideo(id: string, file: any): Promise<string> {
    // const key = `${id}.${file.originalname?.split('.')[1]}`

    const uploadParams = {
      Bucket: this.env.r2bucketName,
      Key: id,
      ContentType: file.mimetype,
    }
    console.log({ file, id, uploadParams })

    try {
      // Step 1: Initiate multipart upload
      const multipartUpload = await this.r2.createMultipartUpload(uploadParams).promise()
      const { UploadId } = multipartUpload

      const partSize = 10 * 1024 * 1024 // Set the desired part size here (e.g., 10MB)
      const buffer = file.buffer
      const numParts = Math.ceil(buffer.length / partSize)

      const uploadPromises = []

      // Step 2: Upload each part individually
      for (let partNumber = 1; partNumber <= numParts; partNumber++) {
        const start = (partNumber - 1) * partSize
        const end = Math.min(start + partSize, buffer.length)
        const partBuffer = buffer.slice(start, end)

        const partParams = {
          Bucket: this.env.r2bucketName,
          Key: id,
          PartNumber: partNumber,
          UploadId,
          Body: partBuffer,
        }

        const uploadPartPromise = this.r2.uploadPart(partParams).promise()
        uploadPromises.push(uploadPartPromise)
      }

      // Step 3: Wait for all parts to finish uploading
      const uploadResults = await Promise.all(uploadPromises)

      const parts = uploadResults.map((result, index) => ({
        ETag: result.ETag,
        PartNumber: index + 1,
      }))

      // Step 4: Complete multipart upload
      const completeParams = {
        Bucket: this.env.r2bucketName,
        Key: id,
        MultipartUpload: {
          Parts: parts,
        },
        UploadId,
      }

      await this.r2.completeMultipartUpload(completeParams).promise()

      const videoUrl = this.r2.getSignedUrl('getObject', {
        Bucket: this.env.r2bucketName,
        Key: id,
        Expires: 3600, // URL expiration time in seconds
      })

      return videoUrl
    } catch (e) {
      console.warn(e)
      throw new InternalServerErrorException(e)
    }
  }

  async downloadVideo(id: string, res: Response) {
    const command = { Bucket: this.env.r2bucketName, Key: id }

    try {
      const stream = this.r2.getObject(command).createReadStream()

      const fileName = id
      const fileExtension = id.split('.').pop()

      // Set the appropriate Content-Disposition header
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
      res.setHeader('Content-Type', `video/${fileExtension}`)

      stream.pipe(res)

      stream.on('error', error => {
        console.error(error)
        res.status(500).end()
      })
    } catch (err) {
      console.log(err)
      throw new InternalServerErrorException(err)
    }
  }

  async test() {
    return
  }
}
