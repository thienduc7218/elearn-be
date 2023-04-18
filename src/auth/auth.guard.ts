import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //NOTE: Verify token go here

    return true
  }
}
