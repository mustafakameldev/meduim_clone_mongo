import { Request } from 'express';
import { User } from 'src/user/schemas/user.schema';

export interface ExpressRequest extends Request {
  user?: User;
}
