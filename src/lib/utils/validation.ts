const SYMBOL_REGEX = /[^a-zA-Z0-9]/;
const EMAIL_SYMBOL_REGEX = /[^a-zA-Z0-9@.\-_+]/;
const NAME_REGEX = /[^a-zA-Z\s]/;

export const containsSymbols = (value: string): boolean => {
  return SYMBOL_REGEX.test(value);
};

export const containsInvalidEmailChars = (value: string): boolean => {
  return EMAIL_SYMBOL_REGEX.test(value);
};

export const containsNameSymbols = (value: string): boolean => {
  return NAME_REGEX.test(value);
};

export const sanitizeInput = (value: string): string => {
  return value.replace(SYMBOL_REGEX, "");
};

export const sanitizeEmailInput = (value: string): string => {
  return value.replace(EMAIL_SYMBOL_REGEX, "");
};

export const sanitizeNameInput = (value: string): string => {
  return value.replace(NAME_REGEX, "");
};
