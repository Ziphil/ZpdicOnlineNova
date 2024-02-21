//


export const IDENTIFIER_REGEXP = /^[a-zA-Z0-9_-]*[a-zA-Z_-]+[a-zA-Z0-9_-]*$/;

export function validateFileSize(limitSizeInMb: number): (file: File) => boolean {
  const validator = function (file: File): boolean {
    const sizeInMb = file.size / 1024 / 1024;
    return sizeInMb <= limitSizeInMb;
  };
  return validator;
}

export function validateFileType(accepts: Array<string>): (file: File) => boolean {
  const validator = function (file: File): boolean {
    return accepts.includes(file.type);
  };
  return validator;
}