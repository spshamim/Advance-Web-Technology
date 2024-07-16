import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Admins } from "src/Entity/admin.entity";
import { Managers } from "src/Entity/manager.entity";
import { JWTConfig } from "src/JWT/JWTconfig";
import { MailerModule } from "@nestjs-modules/mailer";

@Module({
    imports: [TypeOrmModule.forFeature([Admins,Managers]),JWTConfig,
    MailerModule.forRoot({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: 'example@gmail.com', // Gmail account
            pass: 'XXX YYY ZZZ', // Generated app password for Gmail
          },
        },
      }),
    ],  
    controllers: [AdminController],
    providers: [AdminService],
    exports: [AdminService] // when AdminService need to use somewhere after adding AdminModule there
})
export class AdminModule {}