import {
  NumberRequired,
  StringNotRequired,
  StringRequired,
} from 'common/decorators';

export class CreatePostDto {
  @StringRequired('Tiêu đề')
  title: string;

  @StringRequired('Mô tả')
  desc: string;

  @StringNotRequired
  content?: string;

  @NumberRequired('id danh mục')
  categoryId: number;
}
