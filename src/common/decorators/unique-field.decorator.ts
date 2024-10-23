import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EntityTarget, DataSource } from 'typeorm';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const [EntityClass, property] = validationArguments.constraints;
    const repository = this.dataSource.getRepository(EntityClass);
    const entity = await repository.findOne({ where: { [property]: value } });
    return !entity;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} already exists`;
  }
}

export function IsUnique<MODEL>(
  model: EntityTarget<MODEL>,
  uniqueField: keyof MODEL,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [model, uniqueField],
      validator: IsUniqueConstraint,
    });
  };
}
