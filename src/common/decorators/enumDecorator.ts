import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

type EnumType = Record<string, string | number>;

export const EnumRequired = <T extends EnumType>(enumType: T, name: string) =>
  applyDecorators(
    ApiProperty({
      required: true,
      enum: enumType,
      description: `${name} (${Object.values(enumType).join(', ')})`,
    }),
    IsNotEmpty({ message: `${name} không được để trống` }),
    IsEnum(enumType, { message: `${name} không hợp lệ` }),
  );

export const EnumNotRequired = <T extends EnumType>(enumType: T) =>
  applyDecorators(
    ApiProperty({
      required: false,
      enum: enumType,
      description: Object.values(enumType).join(', '),
    }),
    IsEnum(enumType, { message: `Giá trị không hợp lệ` }),
  );
