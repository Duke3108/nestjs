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
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtGuard } from 'modules/auth/guards/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post(':postId')
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req,
    @Param('postId') postId: number,
  ) {
    return this.commentService.create(createCommentDto, req.user.id, postId);
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(id, updateCommentDto);
  }

  @Delete('hide/:id')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  hidePost(@Param('id') id: number) {
    return this.commentService.hideComment(id);
  }

  @Post('activate/:id')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  unhidePost(@Param('id') id: number) {
    return this.commentService.activeComment(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.commentService.remove(id);
  }

  @Post('like/:id')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  likePost(@Param('id') id: number, @Req() req) {
    return this.commentService.likeComment(id, req.user.id);
  }

  @Delete('like/:id')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  unlikePost(@Param('id') id: number, @Req() req) {
    return this.commentService.unlikeComment(id, req.user.id);
  }
}
