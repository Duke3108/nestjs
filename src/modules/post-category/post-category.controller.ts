import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostCategoryService } from './post-category.service';
import { CreatePostCategoryDto } from './dto/create-post-category.dto';
import { UpdatePostCategoryDto } from './dto/update-post-category.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtGuard } from 'modules/auth/guards/jwt.guard';

@Controller('post-category')
export class PostCategoryController {
  constructor(private readonly postCategoryService: PostCategoryService) {}

  @ApiOperation({ summary: 'Tạo danh mục bài viết (Admin only)' })
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  create(@Body() createPostCategoryDto: CreatePostCategoryDto) {
    return this.postCategoryService.create(createPostCategoryDto);
  }

  @Get()
  findAll(@Query() query) {
    return this.postCategoryService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.postCategoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updatePostCategoryDto: UpdatePostCategoryDto,
  ) {
    return this.postCategoryService.update(id, updatePostCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.postCategoryService.remove(id);
  }
}
