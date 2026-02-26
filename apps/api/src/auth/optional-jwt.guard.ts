import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    // If err or no user, just return undefined instead of throwing UnauthorizedException
    if (err || !user) {
      return undefined;
    }
    return user;
  }
}
