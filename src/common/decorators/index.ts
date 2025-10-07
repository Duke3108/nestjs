import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export const StringRequired = (name: string) =>
  applyDecorators(
    ApiProperty({ required: true }),
    IsString({ message: `${name} phải là một chuỗi` }),
    IsNotEmpty({ message: `${name} không được để trống` }),
  );

export const StringNotRequired = applyDecorators(
  ApiProperty({ required: false }),
  IsString(),
  IsOptional(),
);

export const NumberRequired = (name: string, min: number = 0, max?: number) =>
  applyDecorators(
    ApiProperty({ required: true }),
    IsNumber(),
    IsNotEmpty({ message: `${name} không được để trống` }),
    Type(() => Number),
    Min(min, { message: `Giá trị tối thiểu là ${min}` }),
    ...(max ? [Max(max, { message: `Giá trị tối đa là ${max}` })] : []),
  );

export const NumberNotRequired = applyDecorators(
  ApiProperty({ required: false }),
  IsNumber(),
  IsOptional(),
  Type(() => Number),
);

export const BooleanNotRequired = applyDecorators(
  ApiProperty({ required: false }),
  IsBoolean(),
  IsOptional(),
);

export const EnumRequired = (enumType: any, name: string) =>
  applyDecorators(
    ApiProperty({ required: true }),
    IsNotEmpty({ message: `${name} không được để trống` }),
    IsEnum(enumType, { message: `${enumType} không hợp lệ` }),
  );

export const ArrayNotRequired = <T>(itemType: new () => T) =>
  applyDecorators(
    ApiProperty({ required: false, type: [itemType] }),
    IsOptional(),
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => itemType),
  );
