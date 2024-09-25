//


export const IDENTIFIER_REGEXP = /^$|^[a-zA-Z0-9_-]*[a-zA-Z_-]+[a-zA-Z0-9_-]*$/;

export function validateFileSize(limitSizeInMb: number): (file: File | undefined) => boolean {
  const validator = function (file: File | undefined): boolean {
    if (file !== undefined) {
      const sizeInMb = file.size / 1024 / 1024;
      return sizeInMb <= limitSizeInMb;
    } else {
      return true;
    }
  };
  return validator;
}

export function validateFileType(accepts: Array<string>): (file: File | undefined) => boolean {
  const validator = function (file: File | undefined): boolean {
    if (file !== undefined) {
      return accepts.includes(file.type);
    } else {
      return true;
    }
  };
  return validator;
}

export function validateRegexpPattern(): (string: string | undefined) => boolean {
  const validator = function (string: string | undefined): boolean {
    if (string !== undefined) {
      try {
        const regexp = new RegExp(string);
        return true;
      } catch (error) {
        return false;
      }
    } else {
      return true;
    }
  };
  return validator;
}