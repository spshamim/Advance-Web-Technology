import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminService } from 'src/admin/admin.service';
import { AdminLoginDTO } from 'src/DTO/admin.dto';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService
  ) {}

  async Login( logindata:AdminLoginDTO): Promise<{ access_token: string }> {
    const user = await this.adminService.findOne(logindata);
    if (!user) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(logindata.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }
    
    const payload = { id: user.id, username: user.username }; // Store an object(must) in the payload -> purpose (to retrieve later)

    return { access_token: await this.jwtService.signAsync(payload) }; // generating token and return
  }

}

