import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { appEnv } from 'src/app.env'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, @Inject(appEnv.KEY) private env: ConfigType<typeof appEnv>) {}

  private async verifyToken(request: any) {
    const token = request.headers.authorization

    const basic = token.split(' ')
    if (basic.length !== 2) {
      throw new UnauthorizedException('Malformed token')
    }
    const scheme = basic[0]
    const encoded = basic[1]
    if (!/^Bearer$/i.test(scheme)) {
      throw new UnauthorizedException('Malformed token')
    }

    try {
      const payload = await this.jwtService.verifyAsync(encoded, { secret: this.env.jwtSecret })
      request['user'] = payload
    } catch (e) {
      throw new UnauthorizedException(e.message)
    }
    return true
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    return this.verifyToken(request)
  }
}
