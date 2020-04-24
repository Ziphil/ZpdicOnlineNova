//


export const IDENTIFIER_VALIDATION = /^[a-zA-Z0-9_-]*[a-zA-Z_-]+[a-zA-Z0-9_-]*$/;
export const EMAIL_VALIDATION = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export function validatePassword(password: string): boolean {
  let length = password.length;
  let predicate = length < 6 || length > 50;
  return predicate;
}