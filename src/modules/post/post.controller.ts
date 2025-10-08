import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from 'modules/auth/guards/jwt.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { storage } from 'config/multer.config';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @UseInterceptors(FilesInterceptor('files', 10, { storage }))
  create(
    @Body() createPostDto: CreatePostDto,
    @Req() req,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.postService.create(req.user.id, createPostDto, files);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete('hide/:id')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  hidePost(@Param('id') id: number) {
    return this.postService.hidePost(id);
  }

  @Post('activate/:id')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  unhidePost(@Param('id') id: number) {
    return this.postService.activePost(id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  remove(@Param('id') id: number) {
    return this.postService.remove(id);
  }

  @Post('like/:id')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  likePost(@Param('id') id: number, @Req() req) {
    return this.postService.likePost(id, req.user.id);
  }

  @Delete('like/:id')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  unlikePost(@Param('id') id: number, @Req() req) {
    return this.postService.unlikePost(id, req.user.id);
  }
}
