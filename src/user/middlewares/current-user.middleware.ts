import { NestMiddleware } from '@nestjs/common';
import { UserService } from '../user.service';

export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}
  async use(req: any, res: any, next: (error?: any) => void) {
    const { userId } = req.session || {};
    if (userId) {
      const user = await this.userService.findOne(userId);
      req.currentUser = user;
    }
    next();
  }
}
