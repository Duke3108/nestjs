import { StringRequired } from '../../../common/decorators/stringDecorator';

export class CreatePostCategoryDto {
  @StringRequired('Tên không được để trống')
  name: string;
}
