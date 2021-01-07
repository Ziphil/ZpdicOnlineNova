//

import axios from "axios";
import {
  AWS_STORAGE_BUCKET
} from "/client/variable";


export class AwsUtil {

  public static async uploadFile(post: PresignedPost, file: Blob): Promise<void> {
    let formData = new FormData();
    for (let [key, value] of Object.entries(post.fields)) {
      formData.append(key, value);
    }
    formData.append("file", file);
    await axios.post(post.url, formData);
  }

  public static uploadFileByUrl(url: string, file: Blob): Promise<void> {
    let promise = new Promise<void>((resolve, reject) => {
      let client = new XMLHttpRequest();
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
    let url = `https://${AWS_STORAGE_BUCKET}.s3.amazonaws.com/${path}`;
    return url;
  }

}


export type PresignedPost = {url: string, fields: Record<string, string>};