//

import {TestConfig} from "yup";


/** 識別子をテストします。
 * 空文字列と `undefined` は許可されます。*/
export function testIdentifier(message?: string): TestConfig<string | undefined> {
  const regexp = /^$|^[a-zA-Z0-9_-]*[a-zA-Z_-]+[a-zA-Z0-9_-]*$/;
  const test = function (string: string | undefined): boolean {
    return string === undefined || regexp.test(string);
  };
  return {name: "identifier", message, test};
}

export function testFileSize(limitSizeInMb: number, message?: string): TestConfig<File | undefined> {
  const test = function (file: File | undefined): boolean {
    if (file !== undefined) {
      const sizeInMb = file.size / 1024 / 1024;
      return sizeInMb <= limitSizeInMb;
    } else {
      return true;
    }
  };
  return {name: "fileSize", message, test};
}

export function testFileType(accepts: Array<string>, message?: string): TestConfig<File | undefined> {
  const test = function (file: File | undefined): boolean {
    if (file !== undefined) {
      return accepts.includes(file.type);
    } else {
      return true;
    }
  };
  return {name: "fileType", message, test};
}

export function testRegexpPattern(message?: string): TestConfig<string | undefined> {
  const test = function (string: string | undefined): boolean {
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
  return {name: "regexpPattern", message, test};
}