//

import {
  S3 as StorageClient
} from "aws-sdk";
import {
  AWS_STORAGE_BUCKET
} from "/server/variable";


export class AwsUtil {

  public static getUploadFilePost(path: string, configs: PresignedPostConfigs): Promise<PresignedPost> {
    let client = new StorageClient();
    let nextConfigs = Object.assign({}, DEFAULT_PRESIGNED_POST_CONFIGS, configs);
    let conditions = [] as PresignedPostConditions;
    conditions.push(["eq", "$bucket", AWS_STORAGE_BUCKET]);
    conditions.push(["starts-with", "$key", path]);
    conditions.push(["eq", "$acl", nextConfigs.acl]);
    if (nextConfigs.contentType !== undefined) {
      conditions.push(["starts-with", "$Content-Type", nextConfigs.contentType]);
    }
    if (nextConfigs.sizeLimit !== undefined) {
      conditions.push(["content-length-range", 0, nextConfigs.sizeLimit]);
    }
    let params = Object.fromEntries([
      ["Bucket", AWS_STORAGE_BUCKET],
      ["Fields", {key: path}],
      ["Expires", nextConfigs.expires],
      ["Conditions", conditions]
    ]);
    let promise = new Promise<PresignedPost>((resolve, reject) => {
      client.createPresignedPost(params, (error, data) => {
        if (!error) {
          let url = data.url;
          let additionalFields = {acl: nextConfigs.acl};
          let fields = {...data.fields, ...additionalFields};
          let nextData = {url, fields};
          resolve(nextData);
        } else {
          reject(error);
        }
      });
    });
    return promise;
  }

  public static getUploadFileUrl(path: string, configs: PresignedUrlConfigs): Promise<string> {
    let client = new StorageClient();
    let nextConfigs = Object.assign({}, DEFAULT_PRESIGNED_URL_CONFIGS, configs);
    let params = Object.fromEntries([
      ["Bucket", AWS_STORAGE_BUCKET],
      ["Key", path],
      ["ContentType", nextConfigs.contentType],
      ["Expires", nextConfigs.expires],
      ["ACL", nextConfigs.acl]
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
    ]) as any;
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
    ]) as any;
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


export type PresignedPost = {url: string, fields: Record<string, string>};
export type PresignedPostConditions = Array<[string, ...Array<unknown>]>;

type PresignedPostConfigs = {
  contentType?: string,
  sizeLimit?: number,
  expires?: number,
  acl?: "private" | "public-read" | "public-read-write"
};
const DEFAULT_PRESIGNED_POST_CONFIGS = {
  expires: 60,
  acl: "public-read"
};

type PresignedUrlConfigs = {
  contentType: string,
  expires?: number,
  acl?: "private" | "public-read" | "public-read-write"
};
const DEFAULT_PRESIGNED_URL_CONFIGS = {
  expires: 60,
  acl: "public-read"
};