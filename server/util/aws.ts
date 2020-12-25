//

import {
  S3 as StorageApi
} from "aws-sdk";
import {
  AWS_STORAGE_BUCKET
} from "/server/variable";


export class AwsUtil {

  public static getUploadResourceUrl(path: string, type: string): Promise<string> {
    let api = new StorageApi();
    let params = Object.fromEntries([
      ["Bucket", AWS_STORAGE_BUCKET],
      ["Key", path],
      ["ContentType", type],
      ["Expires", 60],
      ["ACL", "public-read"]
    ]);
    let promise = new Promise<string>((resolve, reject) => {
      api.getSignedUrl("putObject", params, (error, url) => {
        if (!error) {
          resolve(url);
        } else {
          reject(error);
        }
      });
    });
    return promise;
  }

}