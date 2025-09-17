import * as bcrypt from 'bcrypt';

export function encodePassword(rawPassword: string): string {
  const SALT: string = bcrypt.genSaltSync() as string;
  return bcrypt.hashSync(rawPassword, SALT) as string;
}

export function comparePassword(rawPassword: string, hash: string): boolean {
  return bcrypt.compareSync(rawPassword, hash) as boolean;
}
