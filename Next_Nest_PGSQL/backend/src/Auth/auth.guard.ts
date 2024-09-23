import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { decrypt } from 'src/Utils/crypto.util';

@Injectable()
export class RolesGuard implements CanActivate {
    private jwtService: JwtService;
    private allowedRoles: string[];

    constructor(private requiredRole: string) {
        this.jwtService = new JwtService({ secret: process.env.JWT_SECRET });
        this.allowedRoles = ['Admin', 'Patient', 'Doctor', 'Pharmacies'];
        if (!this.allowedRoles.includes(this.requiredRole)) {
            throw new ForbiddenException();
        }
    }

    private extractTokenFromCookie(request: Request): string | undefined {
        return request.cookies['jwt'];
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const decryptedToken = this.extractTokenFromCookie(request);

        if (!decryptedToken) {
            throw new UnauthorizedException("No token in cookie.");
        }

        try {
            const token = decrypt(decryptedToken);
            const payload = await this.jwtService.verifyAsync(token);

            if (!payload.roles.includes(this.requiredRole)) {
                throw new UnauthorizedException("You are not allowed to this route.");
            }

            request['user'] = payload;

        } catch (error) {
            throw new UnauthorizedException();
        }

        return true;
    }
}
