//

import * as jwt from "jsonwebtoken";
import {JwtPayload, SignOptions as JwtSignOptions} from "jsonwebtoken";
import {JWT_SECRET} from "/server/variable";


export function verifyJwt(token: string): Promise<JwtPayload> {
  const promise = new Promise<JwtPayload>((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (error, data) => {
      if (error) {
        reject(error);
      } else {
        if (data !== undefined && typeof data === "object") {
          resolve(data);
        } else {
          reject("invalid token");
        }
      }
    });
  });
  return promise;
}

export function signJwt(payload: object, options: JwtSignOptions): Promise<string | undefined> {
  const promise = new Promise<string | undefined>((resolve, reject) => {
    jwt.sign(payload, JWT_SECRET, options, (error, token) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
  });
  return promise;
}