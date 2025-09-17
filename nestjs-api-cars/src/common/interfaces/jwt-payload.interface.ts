// import { Confirmation, Session } from 'src/modules/auth/entities';

export interface JwtPayload {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  changePass: boolean;
  isActive: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  // sessions?: Session[];
  // confirmation: Confirmation;
}
