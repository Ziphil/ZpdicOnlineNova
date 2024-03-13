//

import {NextFunction, Request, RequestHandler, Response} from "express";
import * as jwt from "jsonwebtoken";
import {CustomError} from "/client/skeleton";
import {
  DictionaryAuthority,
  DictionaryModel,
  UserModel
} from "/server/model";
import {LogUtil} from "/server/util/log";
import {RecaptchaUtil} from "/server/util/recaptcha";
import {JWT_SECRET} from "/server/variable";


/** リクエストのヘッダーに書き込まれたトークンを利用して認証を行います。
 * 認証に成功した場合、`request` オブジェクトの `user` プロパティにユーザーオブジェクトを書き込み、次の処理を行います。
 * 認証に失敗した場合、ステータスコード 401 を返して終了します。
 * なお、引数に権限を表す文字列が指定された場合、追加でユーザーが指定の権限を保持しているかチェックし、権限がなかった場合、ステータスコード 403 を返して終了します。*/
export function verifyUser(authority?: string): RequestHandler {
  const handler = async function (request: Request, response: Response, next: NextFunction): Promise<void> {
    const token = (request.signedCookies.authorization || request.headers.authorization) + "";
    jwt.verify(token, JWT_SECRET, async (error, data) => {
      if (!error && typeof data === "object" && "id" in data) {
        const anyData = data as any;
        const user = await UserModel.findById(anyData.id).exec();
        if (user) {
          if (!authority || user.authority === authority) {
            request.user = user;
            next();
          } else {
            const body = CustomError.ofType("notEnoughUserAuthority");
            response.status(403).send(body).end();
          }
        } else {
          response.status(401).end();
        }
      } else {
        response.status(401).end();
      }
    });
  };
  return handler;
}

/** リクエストのヘッダーに書き込まれたトークンを利用してユーザーのチェックを行います。
 * 基本的に `verifyUser` 関数とほぼ同じ動作をしますが、認証に失敗した場合にエラーステータスを返すのではなく次の動作に移行します。*/
export function checkUser(authority?: string): RequestHandler {
  const handler = async function (request: Request, response: Response, next: NextFunction): Promise<void> {
    const token = (request.signedCookies.authorization || request.headers.authorization) + "";
    jwt.verify(token, JWT_SECRET, async (error, data) => {
      if (!error && typeof data === "object" && "id" in data) {
        const anyData = data as any;
        const user = await UserModel.findById(anyData.id).exec();
        if (user) {
          if (!authority || user.authority === authority) {
            request.user = user;
            next();
          } else {
            next();
          }
        } else {
          next();
        }
      } else {
        next();
      }
    });
  };
  return handler;
}

/** ログイン中のユーザーにリクエストしている辞書データの編集権限があるかどうかを判定します。
 * このミドルウェアは、必ず `verifyUser` や `checkUser` ミドルウェアを通してから呼び出してください。
 * また、リクエストクエリもしくはリクエストボディに `number` が指定されている必要があります。
 * 編集権限がある場合、`request` オブジェクトの `dictionary` プロパティに辞書オブジェクトを書き込み、次の処理を行います。
 * 編集権限がない場合、ステータスコード 403 を返して終了します。
 * そもそも該当する辞書が存在しない場合、`request` オブジェクトの `dictionary` プロパティの値は `undefined` のまま、次の処理を行います。*/
export function verifyDictionary(authority: DictionaryAuthority): RequestHandler {
  const handler = async function (request: any, response: Response, next: NextFunction): Promise<void> {
    try {
      const user = request.user!;
      const number = parseInt(request.query.number || request.body.number, 10);
      const dictionary = await DictionaryModel.fetchOneByNumber(number);
      if (dictionary) {
        const hasAuthority = await dictionary.hasAuthority(user, authority);
        if (hasAuthority) {
          request.dictionary = dictionary;
          next();
        } else {
          const body = CustomError.ofType("notEnoughDictionaryAuthority");
          response.status(403).send(body).end();
        }
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  };
  return handler;
}

export function verifyRecaptcha(): RequestHandler {
  const handler = async function (request: any, response: Response, next: NextFunction): Promise<void> {
    const recaptchaToken = request.query.recaptchaToken || request.body.recaptchaToken;
    try {
      const result = await RecaptchaUtil.verify(recaptchaToken);
      const score = result.score;
      const action = result.action;
      LogUtil.log("middle/verifyRecaptcha", {action, score});
      if (result.score >= 0.5) {
        request.recaptchaScore = result.score;
        next();
      } else {
        const body = CustomError.ofType("recaptchaRejected");
        response.status(403).send(body).end();
      }
    } catch (error) {
      if (error.name === "CustomError" && error.type === "recaptchaError") {
        const body = CustomError.ofType("recaptchaError");
        response.status(403).send(body).end();
      } else {
        next(error);
      }
    }
  };
  return handler;
}

/** リクエストボディの情報からログイン認証用のトークンを生成します。
 * 引数として、トークンの有効期限 (秒単位) を受け取ります。
 * ログインに成功した場合 (該当するユーザーが存在した場合)、`request` オブジェクトの `token` プロパティにトークンを書き込み、次の処理を行います。
 * ログインに失敗した場合、ステータスコード 401 を返して終了します。*/
export function login(expiresIn: number): RequestHandler {
  const handler = async function (request: any, response: Response, next: NextFunction): Promise<void> {
    const name = request.body.name;
    const password = request.body.password;
    const user = await UserModel.authenticate(name, password);
    if (user) {
      jwt.sign({id: user.id}, JWT_SECRET, {expiresIn}, (error, token) => {
        if (!error) {
          request.token = token;
          request.user = user;
          const options = {maxAge: expiresIn * 1000, httpOnly: true, signed: true, sameSite: true};
          response.cookie("authorization", token, options);
          next();
        } else {
          next(error);
        }
      });
    } else {
      response.status(401).end();
    }
  };
  return handler;
}

export function logout(): RequestHandler {
  const handler = async function (request: Request, response: Response, next: NextFunction): Promise<void> {
    response.clearCookie("authorization");
    next();
  };
  return handler;
}