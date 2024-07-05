import { CanActivate, Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class AdminGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        if (request.session && request.session.user && request.session.user.username !== undefined) {
            return true;
        } else {
            throw new UnauthorizedException('Unauthorized access');
        }
        /*
            if session object and session.user.username present, then guard will return true otherwise false
            Note : later on "Type" will be used here to authenticate more accurately
        */
    }   
}
