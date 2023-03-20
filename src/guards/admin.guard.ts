import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ExpressRequest } from 'src/types/expressRequest.interface';
import { UserRole } from 'src/user/interfaces/role-tyoe.emun';

export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<ExpressRequest>();
    if (
      request.user?.role == UserRole.admin ||
      request.user?.role == UserRole.superAdmin
    ) {
      return true;
    }
    if (request.user) {
      throw new HttpException('Not allowed', HttpStatus.FORBIDDEN);
    }
    throw new HttpException('Not Authorized', HttpStatus.UNAUTHORIZED);
  }
}
