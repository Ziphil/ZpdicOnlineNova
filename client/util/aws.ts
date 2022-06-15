//

import axios from "axios";
import {
  xml2js as parseXml
} from "xml-js";
import {
  AWS_STORAGE_BUCKET
} from "/client/variable";


export class AwsUtil {

  public static async uploadFile(post: PresignedPost, file: Blob): Promise<void> {
    const formData = new FormData();
    for (const [key, value] of Object.entries(post.fields)) {
      formData.append(key, value);
    }
    formData.append("Content-Type", file.type);
    formData.append("file", file);
    const response = await axios.post(post.url, formData, {validateStatus: () => true});
    if (response.status === 400 || response.status === 403) {
      const result = parseXml(response.data, {compact: true}) as any;
      const errorData = result["Error"];
      if (typeof errorData === "object") {
        throw new AwsError(errorData);
      } else {
        throw new Error();
      }
    }
  }

  public static uploadFileByUrl(url: string, file: Blob): Promise<void> {
    const promise = new Promise<void>((resolve, reject) => {
      const client = new XMLHttpRequest();
      client.open("PUT", url);
      client.onreadystatechange = function (event: Event): void {
        if (client.readyState === 4) {
          if (client.status === 200) {
            resolve();
          } else {
            reject();
          }
        }
      };
      client.send(file);
    });
    return promise;
  }

  public static getFileUrl(path: string): string {
    const url = `https://${AWS_STORAGE_BUCKET}.s3.amazonaws.com/${path}`;
    return url;
  }

}


export class AwsError extends Error {

  public name: "AwsError" = "AwsError";
  public data: any;

  public constructor(data: any) {
    super(data["Message"] ?? "");
    this.data = data;
  }

}


export type PresignedPost = {url: string, fields: Record<string, string>};