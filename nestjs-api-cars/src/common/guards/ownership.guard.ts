import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class OwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const userId = req.user.sub;
    const userRole = req.user.role;
    const paramId = req.params.id;

    if (userRole === 'admin') {
      return true;
    }

    if (userRole === 'client' && userId !== paramId) {
      throw new ForbiddenException('You cannot modify/delete another user.');
    }

    return true;
  }
}
