//

import {
  S3 as StorageClient
} from "aws-sdk";
import {
  AWS_STORAGE_BUCKET
} from "/server/variable";


export class AwsUtil {

  public static getUploadFileUrl(path: string, type: string): Promise<string> {
    let client = new StorageClient();
    let params = Object.fromEntries([
      ["Bucket", AWS_STORAGE_BUCKET],
      ["Key", path],
      ["ContentType", type],
      ["Expires", 60],
      ["ACL", "public-read"]
    ]);
    let promise = new Promise<string>((resolve, reject) => {
      client.getSignedUrl("putObject", params, (error, url) => {
        if (!error) {
          resolve(url);
        } else {
          reject(error);
        }
      });
    });
    return promise;
  }

  public static deleteFile(path: string): Promise<void> {
    let client = new StorageClient();
    let params = Object.fromEntries([
      ["Bucket", AWS_STORAGE_BUCKET],
      ["Key", path]
    ]);
    let promise = new Promise<void>((resolve, reject) => {
      client.deleteObject(params, (error, data) => {
        if (!error) {
          resolve();
        } else {
          reject(error);
        }
      });
    });
    return promise;
  }

  public static getFileNames(path: string): Promise<Array<string>> {
    let client = new StorageClient();
    let modifiedPath = (path.endsWith("/")) ? path : path + "/";
    let params = Object.fromEntries([
      ["Bucket", AWS_STORAGE_BUCKET],
      ["Prefix", modifiedPath]
    ]);
    let promise = new Promise<Array<string>>((resolve, reject) => {
      client.listObjectsV2(params, (error, data) => {
        if (!error) {
          if (data["Contents"] !== undefined) {
            let names = data["Contents"].map((object) => (object["Key"] ?? "").replace(modifiedPath, ""));
            resolve(names);
          } else {
            resolve([]);
          }
        } else {
          reject(error);
        }
      });
    });
    return promise;
  }

}