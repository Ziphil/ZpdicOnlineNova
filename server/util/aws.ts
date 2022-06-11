//

import {
  S3 as StorageClient
} from "aws-sdk";
import {
  AWS_STORAGE_BUCKET
} from "/server/variable";


export class AwsUtil {

  public static getUploadFilePost(path: string, configs: PresignedPostConfigs): Promise<PresignedPost> {
    const client = new StorageClient();
    const nextConfigs = Object.assign({}, DEFAULT_PRESIGNED_POST_CONFIGS, configs);
    const conditions = [] as PresignedPostConditions;
    conditions.push(["eq", "$bucket", AWS_STORAGE_BUCKET]);
    conditions.push(["starts-with", "$key", path]);
    conditions.push(["eq", "$acl", nextConfigs.acl]);
    if (nextConfigs.contentType !== undefined) {
      conditions.push(["starts-with", "$Content-Type", nextConfigs.contentType]);
    }
    if (nextConfigs.sizeLimit !== undefined) {
      conditions.push(["content-length-range", 0, nextConfigs.sizeLimit]);
    }
    const params = Object.fromEntries([
      ["Bucket", AWS_STORAGE_BUCKET],
      ["Fields", {key: path}],
      ["Expires", nextConfigs.expires],
      ["Conditions", conditions]
    ]);
    const promise = new Promise<PresignedPost>((resolve, reject) => {
      client.createPresignedPost(params, (error, data) => {
        if (!error) {
          const url = data.url;
          const additionalFields = {acl: nextConfigs.acl};
          const fields = {...data.fields, ...additionalFields};
          const nextData = {url, fields};
          resolve(nextData);
        } else {
          reject(error);
        }
      });
    });
    return promise;
  }

  public static getUploadFileUrl(path: string, configs: PresignedUrlConfigs): Promise<string> {
    const client = new StorageClient();
    const nextConfigs = Object.assign({}, DEFAULT_PRESIGNED_URL_CONFIGS, configs);
    const params = Object.fromEntries([
      ["Bucket", AWS_STORAGE_BUCKET],
      ["Key", path],
      ["ContentType", nextConfigs.contentType],
      ["Expires", nextConfigs.expires],
      ["ACL", nextConfigs.acl]
    ]);
    const promise = new Promise<string>((resolve, reject) => {
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
    const client = new StorageClient();
    const params = Object.fromEntries([
      ["Bucket", AWS_STORAGE_BUCKET],
      ["Key", path]
    ]) as any;
    const promise = new Promise<void>((resolve, reject) => {
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
    const client = new StorageClient();
    const modifiedPath = (path.endsWith("/")) ? path : path + "/";
    const params = Object.fromEntries([
      ["Bucket", AWS_STORAGE_BUCKET],
      ["Prefix", modifiedPath]
    ]) as any;
    const promise = new Promise<Array<string>>((resolve, reject) => {
      client.listObjectsV2(params, (error, data) => {
        if (!error) {
          if (data["Contents"] !== undefined) {
            const names = data["Contents"].map((object) => (object["Key"] ?? "").replace(modifiedPath, ""));
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