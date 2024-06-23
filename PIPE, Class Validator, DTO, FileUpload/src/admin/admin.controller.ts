import { Body, Controller, Get, Param, ParseIntPipe, Post, Res, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminDTO } from "src/DTO/admin.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterError, diskStorage } from "multer";


@Controller('admin')
export class AdminController {
constructor(private readonly adminService:AdminService) {}
    @Get('test')
    getAdmin(): object {
        return this.adminService.getAdmin();
    }

    @Get('test3/:id') // transformation using PIPE
    getAdminById(@Param('id', ParseIntPipe) userID:number): object {
        console.log(typeof(userID));
        return this.adminService.getAdminById(userID);
    }

    @Post('test2') // the route where i want to apply the validator
    @UsePipes(new ValidationPipe())
    getDTO(@Body() adminDTO:AdminDTO): object {
        return this.adminService.getDTO(adminDTO);
    }

    @Post('upload2') // upload a single file
    @UseInterceptors(FileInterceptor('testImg'))
    uploadFile1(@UploadedFile() testImg: Express.Multer.File) {
        console.log(testImg);
    }

    @Post('upload') // upload single file with validator
    @UseInterceptors(FileInterceptor('file',
    { fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) {
            cb(null, true);
        }
        else {
            cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
    },

    limits: { fileSize: 30000 },
    storage:diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
        cb(null,Date.now()+file.originalname)
    },
    })
    }))

    uploadFile2(@UploadedFile() file: Express.Multer.File) {
        console.log(file);
    }

    @Get('getfile/:name') // View The file
    getImages(@Param('name') name, @Res() res) {
        res.sendFile(name,{ root: './uploads' })
    }
}