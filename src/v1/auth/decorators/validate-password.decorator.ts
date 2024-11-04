import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { PasswordValidationOptions } from '@/src/common/interfaces/password-validation-options.interface';
import { CONSTANTS } from '@/src/constants/common.constant';

@ValidatorConstraint({ async: false })
export class IsValidPasswordConstraint implements ValidatorConstraintInterface {
  validate(password: string, validationArguments: ValidationArguments) {
    const options: PasswordValidationOptions =
      validationArguments.constraints[0];

    // If None Option is provided we set the default values
    const minLength =
      options?.minLength || CONSTANTS.PASSWORD.DEFAULT_MIN_LENGTH;
    const minLowercase =
      options?.minLowercase || CONSTANTS.PASSWORD.DEFAULT_MIN_LOWER_CASE_COUNT;
    const minUppercase =
      options?.minUppercase || CONSTANTS.PASSWORD.DEFAULT_MIN_UPPER_CASE_COUNT;
    const minNumbers =
      options?.minNumbers || CONSTANTS.PASSWORD.DEFAULT_MIN_NUMBER_COUNT;
    const minSpecialCharacters =
      options?.minSpecialCharacters ||
      CONSTANTS.PASSWORD.DEFAULT_MIN_SPECIAL_CHAR_COUNT;

    const lowercaseCount = (password?.match(/[a-z]/g) || []).length;
    const uppercaseCount = (password?.match(/[A-Z]/g) || []).length;
    const numberCount = (password?.match(/[0-9]/g) || []).length;
    const specialCharCount = (password?.match(/[\W_]/g) || []).length;

    return (
      password.length >= minLength &&
      lowercaseCount >= minLowercase &&
      uppercaseCount >= minUppercase &&
      numberCount >= minNumbers &&
      specialCharCount >= minSpecialCharacters
    );
  }

  defaultMessage(validationArguments: ValidationArguments) {
    console.log(validationArguments);
    const options: PasswordValidationOptions =
      validationArguments.constraints[0];
    const {
      minLength = CONSTANTS.PASSWORD.DEFAULT_MIN_LENGTH,
      minLowercase = CONSTANTS.PASSWORD.DEFAULT_MIN_LOWER_CASE_COUNT,
      minSpecialCharacters = CONSTANTS.PASSWORD.DEFAULT_MIN_SPECIAL_CHAR_COUNT,
      minNumbers = CONSTANTS.PASSWORD.DEFAULT_MIN_NUMBER_COUNT,
      minUppercase = CONSTANTS.PASSWORD.DEFAULT_MIN_UPPER_CASE_COUNT,
    } = options || {};
    return `Password must be at least ${minLength} characters long and contain at least ${minUppercase} uppercase letter, ${minLowercase} lowercase letter, ${minNumbers} number, and ${minSpecialCharacters} special character.`;
  }
}

export function IsValidPassword(
  options?: PasswordValidationOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsValidPasswordConstraint,
    });
  };
}
