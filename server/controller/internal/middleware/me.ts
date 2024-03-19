//

import {NextFunction, Request, RequestHandler, Response} from "express";
import {MiddlewareBody} from "/server/controller/internal/controller";
import {UserModel} from "/server/model";
import {verifyJwt} from "/server/util/jwt";


/** リクエストのヘッダーに書き込まれたトークンを利用して認証を行います。
  * 認証に成功した場合は、リクエストオブジェクトの `me` プロパティにユーザーオブジェクトを書き込み、次の処理を行います。
  * 認証に失敗した場合は、次の動作に移行します。*/
export function parseMe(): RequestHandler {
  const handler = async function (request: Request & {middlewareBody: MiddlewareBody}, response: Response, next: NextFunction): Promise<void> {
    const token = (request.signedCookies.authorization || request.headers.authorization) + "";
    try {
      const data = await verifyJwt(token);
      const me = await UserModel.findById(data.id).exec();
      request.middlewareBody.me = me;
    } finally {
      next();
    }
  } as any;
  return handler;
}

/** 認証情報を利用して、ログインしている場合にのみ、次の処理を行うようにします。
  * ログインしていない場合は、ステータスコード 401 を返して終了します。*/
export function authMe(): Array<RequestHandler> {
  const beforeHandler = parseMe();
  const handler = async function (request: Request & {middlewareBody: MiddlewareBody}, response: Response, next: NextFunction): Promise<void> {
    const me = request.middlewareBody.me;
    if (me !== undefined) {
      if (me !== null) {
        next();
      } else {
        response.status(401).end();
      }
    } else {
      next("cannot happen");
    }
  } as any;
  return [beforeHandler, handler];
}