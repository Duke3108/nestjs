import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
