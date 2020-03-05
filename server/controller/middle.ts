//

import {
  NextFunction,
  Request,
  RequestHandler,
  Response
} from "express";
import * as jwt from "jsonwebtoken";
import {
  UserModel
} from "/server/model/user";


const SECRET_KEY = "zpdic_secret";

// リクエストのヘッダーに書き込まれたトークンを利用して認証を行います。
// 認証に成功した場合、request オブジェクトの user プロパティにユーザーオブジェクトを書き込み、次の処理を行います。
// 認証に失敗した場合、リダイレクト先が渡されていればそこにリダイレクトし、そうでなければステータスコード 401 を返して終了します。
export function verifyUser(redirect?: string): RequestHandler {
  let handler = async function (request: Request, response: Response, next: NextFunction): Promise<void> {
    let fail = function (): void {
      if (redirect !== undefined) {
        response.redirect(redirect);
      } else {
        response.sendStatus(401);
      }
    };
    let token = request.headers.authorization;
    if (token !== undefined) {
      jwt.verify(token, SECRET_KEY, async (error, data) => {
        if (!error) {
          let anyData = data as any;
          let user = await UserModel.findById(anyData.id).exec();
          if (user) {
            request.user = user;
            next();
          } else {
            fail();
          }
        } else {
          fail();
        }
      });
    } else {
      fail();
    }
  };
  return handler;
}

// リクエストボディの情報からログイン認証用のトークンを生成します。
// ログインに成功した場合 (該当するユーザーが存在した場合)、request オブジェクトの token プロパティにトークンを書き込み、次の処理を行います。
// ログインに失敗した場合、何も行わずに次の処理を行います。
export function authenticate(expiresIn: string | number): RequestHandler {
  let handler = async function (request: any, response: any, next: NextFunction): Promise<void> {
    let name = request.body.name;
    let password = request.body.password;
    let user = await UserModel.authenticate(name, password);
    if (user) {
      jwt.sign({id: user.id}, SECRET_KEY, {expiresIn}, (error, token) => {
        if (!error) {
          request.token = token;
          request.user = user;
          next();
        } else {
          next(error);
        }
      });
    } else {
      next();
    }
  };
  return handler;
}