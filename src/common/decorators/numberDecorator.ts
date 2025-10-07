import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';

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
