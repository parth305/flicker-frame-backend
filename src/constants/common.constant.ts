export const CONSTANTS = {
  USERS: {
    USER_FIRST_NAME_MAX_LENGTH: 30,
    USER_LAST_NAME_MAX_LENGTH: 30,
  },
  ERROR_MESSAGE: {
    TOKEN_MISSING: 'Access Token Missing',
    INVALID_TOKEN: 'Invalid token',
    USER_ALREADY_LOGGED_OUT: 'User Already token',
    OTP_TIME_EXPIRED: 'Otp is expired , kindly generate the new one.',
    MAX_OTP_ATTEMPTS_REACHED:
      'You have exceeded the maximum number of otp attempts',
    EMAIL_NOT_VERIFIED: 'Email Is not verified',
  },
  PASSWORD: {
    DEFAULT_MIN_LENGTH: 8,
    DEFAULT_MIN_SPECIAL_CHAR_COUNT: 1,
    DEFAULT_MIN_UPPER_CASE_COUNT: 1,
    DEFAULT_MIN_LOWER_CASE_COUNT: 1,
    DEFAULT_MIN_NUMBER_COUNT: 1,
  },
  OTP: {
    LENGTH: 6,
    MAX_ALLOWED_ATTEMPTS: 5,
    OTP_EXPIRY_TIME_IN_SECONDS: 300,
  },
};
