import { User } from '../schemas/user.schema';

export interface UserResponseInterface extends User {
  token: string;
}
