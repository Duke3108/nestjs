import { StringRequired } from 'common/decorators';

export class CreateCommentDto {
  @StringRequired('Bình luận không được để trống')
  content: string;
}
