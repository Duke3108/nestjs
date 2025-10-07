import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export const ArrayRequired = <T>(itemType: new () => T) =>
  applyDecorators(
    ApiProperty({ required: true, type: [itemType] }),
    IsNotEmpty({ message: `Mảng không được để trống` }),
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => itemType),
  );

export const ArrayNotRequired = <T>(itemType: new () => T) =>
  applyDecorators(
    ApiProperty({ required: false, type: [itemType] }),
    IsOptional(),
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => itemType),
  );
