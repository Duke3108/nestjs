import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export const BooleanRequired = (name: string) =>
  applyDecorators(
    ApiProperty({ required: true }),
    IsBoolean({ message: `${name} phải là một giá trị boolean` }),
    IsNotEmpty({ message: `${name} không được để trống` }),
  );

export const BooleanNotRequired = applyDecorators(
  ApiProperty({ required: false }),
  IsBoolean(),
  IsOptional(),
);
