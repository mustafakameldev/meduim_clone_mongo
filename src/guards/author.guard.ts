import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ExpressRequest } from 'src/types/expressRequest.interface';
import { UserRole } from 'src/user/interfaces/role-tyoe.emun';

export class AuthorGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<ExpressRequest>();
    if (request.user?.role == UserRole.author) {
      return true;
    }
    if (request.user) {
      throw new HttpException('Not allowed', HttpStatus.FORBIDDEN);
    }
    throw new HttpException('Not Authorized', HttpStatus.UNAUTHORIZED);
  }
}
