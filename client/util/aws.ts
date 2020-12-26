//

import {
  AWS_STORAGE_BUCKET
} from "/client/variable";


export class AwsUtil {

  public static uploadFile(url: string, file: Blob): Promise<void> {
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