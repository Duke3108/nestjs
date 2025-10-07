import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostCategoryService } from './post-category.service';
import { CreatePostCategoryDto } from './dto/create-post-category.dto';
import { UpdatePostCategoryDto } from './dto/update-post-category.dto';

@Controller('post-category')
export class PostCategoryController {
  constructor(private readonly postCategoryService: PostCategoryService) {}

  @Post()
  create(@Body() createPostCategoryDto: CreatePostCategoryDto) {
    return this.postCategoryService.create(createPostCategoryDto);
  }

  @Get()
  findAll() {
    return this.postCategoryService.findAll();
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
