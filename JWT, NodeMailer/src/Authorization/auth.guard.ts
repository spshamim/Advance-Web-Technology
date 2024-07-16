import {CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtSecret } from 'src/JWT/jwtSecret';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    private extractTokenFromHeader(request: Request): string | undefined {
        /*
            extract the token from the request header
            in Postman, in Authorization tab we are putting the token
        */
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    private extractTokenFromCookie(request: Request): string | undefined {
        return request.cookies['jwt'];
    }
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        /*
            verify the token using verifyAsync 
        */
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request) || this.extractTokenFromCookie(request);;

        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: jwtSecret.secret
                }
            );
            request['user'] = payload; // attaching the payload (user data) to the request object.
        } catch {
            throw new UnauthorizedException();
        }

        return true;
    }
}