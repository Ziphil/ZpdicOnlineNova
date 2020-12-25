//

import {
  S3 as StorageApi
} from "aws-sdk";


export class AwsUtil {

  public static getUploadResourceUrl(name: string, type: string): Promise<string> {
    let api = new StorageApi();
    let params = Object.fromEntries([
      ["Bucket", process.env["AWS_BUCKET"]],
      ["Key", name],
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