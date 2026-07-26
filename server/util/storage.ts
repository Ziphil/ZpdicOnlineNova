//

import {DeleteObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client as StorageClient} from "@aws-sdk/client-s3";
import {createPresignedPost} from "@aws-sdk/s3-presigned-post";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {AWS_KEY, AWS_REGION, AWS_SECRET, AWS_STORAGE_BUCKET} from "/server/variable";


const client = new StorageClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_KEY,
    secretAccessKey: AWS_SECRET
  }
});

export async function getStorageUploadFilePost(path: string, configs: PresignedPostConfigs): Promise<PresignedPost> {
  const actualConfigs = Object.assign({}, DEFAULT_PRESIGNED_POST_CONFIGS, configs);
  const presignedPost = await createPresignedPost(client, {
    "Bucket": AWS_STORAGE_BUCKET,
    "Key": path,
    "Conditions": [
      ["eq", "$bucket", AWS_STORAGE_BUCKET],
      ["starts-with", "$key", path],
      ["eq", "$acl", actualConfigs.acl],
      ["starts-with", "$Content-Type", actualConfigs.contentType],
      ["content-length-range", 0, actualConfigs.sizeLimit]
    ],
    "Fields": {acl: actualConfigs.acl},
    "Expires": actualConfigs.expires
  });
  return {url: presignedPost.url, fields: presignedPost.fields};
}

export async function getStorageUploadFileUrl(path: string, configs: PresignedUrlConfigs): Promise<string> {
  const actualConfigs = Object.assign({}, DEFAULT_PRESIGNED_URL_CONFIGS, configs);
  const command = new PutObjectCommand({
    "Bucket": AWS_STORAGE_BUCKET,
    "Key": path,
    "ContentType": actualConfigs.contentType,
    "ACL": actualConfigs.acl
  });
  const url = await getSignedUrl(client, command, {
    expiresIn: actualConfigs.expires
  });
  return url;
}

export async function deleteStorageFile(path: string): Promise<void> {
  const command = new DeleteObjectCommand({
    "Bucket": AWS_STORAGE_BUCKET,
    "Key": path
  });
  await client.send(command);
}

export async function getStorageFileNames(path: string): Promise<Array<string>> {
  const modifiedPath = (path.endsWith("/")) ? path : path + "/";
  const command = new ListObjectsV2Command({
    "Bucket": AWS_STORAGE_BUCKET,
    "Prefix": modifiedPath
  });
  const data = await client.send(command);
  if (data["Contents"] !== undefined) {
    const names = data["Contents"].map((object) => (object["Key"] ?? "").replace(modifiedPath, ""));
    return names;
  } else {
    return [];
  }
}

export type PresignedPost = {url: string, fields: Record<string, string>};

type PresignedPostConfigs = {
  contentType: string,
  sizeLimit: number,
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