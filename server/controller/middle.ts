//

import {
  NextFunction,
  Request,
  RequestHandler,
  Response
} from "express";
import * as jwt from "jsonwebtoken";
import {
  DEFAULT_JWT_SECRET
} from "/server/index";
import {
  SlimeDictionaryModel
} from "/server/model/dictionary/slime";
import {
  UserModel
} from "/server/model/user";


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
    let token = request.signedCookies.authorization || request.headers.authorization;
    if (typeof token === "string") {
      let secret = process.env["JWT_SECRET"] || DEFAULT_JWT_SECRET;
      jwt.verify(token, secret, async (error, data) => {
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

// ログイン中のユーザーにリクエストしている辞書データの編集権限があるかどうかを判定します。
// このミドルウェアは、必ず verifyUser ミドルウェアを通してから呼び出してください。
// 編集権限がある場合は、request オブジェクトの dictionary プロパティに辞書オブジェクトを書き込み、次の処理を行います。
// 編集権限がない場合、リダイレクト先が渡されていればそこにリダイレクトし、そうでなければステータスコード 401 を返して終了します。
export function verifyDictionary(redirect?: string): RequestHandler {
  let handler = async function (request: any, response: Response, next: NextFunction): Promise<void> {
    let fail = function (): void {
      if (redirect !== undefined) {
        response.redirect(redirect);
      } else {
        response.sendStatus(401);
      }
    };
    let user = request.user!;
    let number = parseInt(request.query.number || request.body.number, 10);
    let dictionary = await SlimeDictionaryModel.findOneByNumber(number, user);
    if (dictionary) {
      request.dictionary = dictionary;
      next();
    } else {
      fail();
    }
  };
  return handler;
}

// リクエストボディの情報からログイン認証用のトークンを生成します。
// ログインに成功した場合 (該当するユーザーが存在した場合)、request オブジェクトの token プロパティにトークンを書き込み、次の処理を行います。
// ログインに失敗した場合、何も行わずに次の処理を行います。
export function login(expiresIn: string): RequestHandler {
  let handler = async function (request: any, response: Response, next: NextFunction): Promise<void> {
    let name = request.body.name;
    let password = request.body.password;
    let user = await UserModel.authenticate(name, password);
    if (user) {
      let secret = process.env["JWT_SECRET"] || DEFAULT_JWT_SECRET;
      jwt.sign({id: user.id}, secret, {expiresIn}, (error, token) => {
        if (!error) {
          request.token = token;
          request.user = user;
          let ms = require("ms");
          let options = {maxAge: ms(expiresIn), httpOnly: true, signed: true, sameSite: true};
          response.cookie("authorization", token, options);
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

export function logout(): RequestHandler {
  let handler = async function (request: any, response: Response, next: NextFunction): Promise<void> {
    response.clearCookie("authorization");
  };
  return handler;
}