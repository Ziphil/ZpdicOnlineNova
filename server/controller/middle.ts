//

import {
  NextFunction,
  Request,
  RequestHandler,
  Response
} from "express";
import * as jwt from "jsonwebtoken";
import {
  JWT_SECRET
} from "/server/index";
import {
  SlimeDictionaryModel
} from "/server/model/dictionary/slime";
import {
  UserModel
} from "/server/model/user";


// リクエストのヘッダーに書き込まれたトークンを利用して認証を行います。
// 認証に成功した場合、request オブジェクトの user プロパティにユーザーオブジェクトを書き込み、次の処理を行います。
// 認証に失敗した場合、ステータスコード 401 を返して終了します。
export function verifyUser(authority?: unknown): RequestHandler {
  let handler = async function (request: Request, response: Response, next: NextFunction): Promise<void> {
    let token = request.signedCookies.authorization || request.headers.authorization;
    if (typeof token === "string") {
      jwt.verify(token, JWT_SECRET, async (error, data) => {
        if (!error) {
          let anyData = data as any;
          let user = await UserModel.findById(anyData.id).exec();
          if (user) {
            request.user = user;
            next();
          } else {
            response.sendStatus(401);
          }
        } else {
          response.sendStatus(401);
        }
      });
    } else {
      response.sendStatus(401);
    }
  };
  return handler;
}

// ログイン中のユーザーにリクエストしている辞書データの編集権限があるかどうかを判定します。
// このミドルウェアは、必ず verifyUser ミドルウェアを通してから呼び出してください。
// 編集権限がある場合は、request オブジェクトの dictionary プロパティに辞書オブジェクトを書き込み、次の処理を行います。
// 編集権限がない場合、ステータスコード 401 を返して終了します。
export function verifyDictionary(): RequestHandler {
  let handler = async function (request: any, response: Response, next: NextFunction): Promise<void> {
    let user = request.user!;
    let number = parseInt(request.query.number || request.body.number, 10);
    let dictionary = await SlimeDictionaryModel.findOneByNumber(number, user);
    if (dictionary) {
      request.dictionary = dictionary;
      next();
    } else {
      response.sendStatus(401);
    }
  };
  return handler;
}

// リクエストボディの情報からログイン認証用のトークンを生成します。
// 引数として、トークンの有効期限 (秒単位) を受け取ります。
// ログインに成功した場合 (該当するユーザーが存在した場合)、request オブジェクトの token プロパティにトークンを書き込み、次の処理を行います。
// ログインに失敗した場合、ステータスコード 401 を返して終了します。
export function login(expiresIn: number): RequestHandler {
  let handler = async function (request: any, response: Response, next: NextFunction): Promise<void> {
    let name = request.body.name;
    let password = request.body.password;
    let user = await UserModel.authenticate(name, password);
    if (user) {
      jwt.sign({id: user.id}, JWT_SECRET, {expiresIn}, (error, token) => {
        if (!error) {
          request.token = token;
          request.user = user;
          let options = {maxAge: expiresIn * 1000, httpOnly: true, signed: true, sameSite: true};
          response.cookie("authorization", token, options);
          next();
        } else {
          next(error);
        }
      });
    } else {
      response.sendStatus(401);
    }
  };
  return handler;
}

export function logout(): RequestHandler {
  let handler = async function (request: any, response: Response, next: NextFunction): Promise<void> {
    response.clearCookie("authorization");
    next();
  };
  return handler;
}