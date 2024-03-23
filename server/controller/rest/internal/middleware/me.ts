//

import {NextFunction, Request, RequestHandler, Response} from "express";
import {MiddlewareBody} from "/server/controller/rest/internal/controller";
import {CustomErrorCreator} from "/server/creator/error";
import {UserModel} from "/server/model";
import {verifyJwt} from "/server/util/jwt";


/** リクエストのヘッダーに書き込まれたトークンを利用して認証を行います。
  * 認証に成功した場合は、リクエストオブジェクトの `me` プロパティにユーザーオブジェクトを書き込みます。
  * 認証に失敗した場合は、リクエストオブジェクトの `me` プロパティに `null` を書き込みます。*/
export function parseMe(): RequestHandler {
  const handler = async function (request: Request & {middlewareBody: MiddlewareBody}, response: Response, next: NextFunction): Promise<void> {
    const token = (request.signedCookies.authorization || request.headers.authorization) + "";
    try {
      const data = await verifyJwt(token);
      const me = await UserModel.findById(data.id).exec();
      request.middlewareBody.me = me;
      next();
    } catch (error) {
      next(error);
    }
  } as any;
  return handler;
}

/** 認証情報を利用して、ログインしている場合にのみ、次の処理を行うようにします。
  * ログインしていない場合は、401 エラーを返して終了します。
  * ログインしていても指定された権限がない場合は、`notEnoughUserAuthority` 403 エラーを返して終了します。*/
export function checkMe(authority?: "admin" | "none"): Array<RequestHandler> {
  const beforeHandler = parseMe();
  const handler = async function (request: Request & {middlewareBody: MiddlewareBody}, response: Response, next: NextFunction): Promise<void> {
    const me = request.middlewareBody.me;
    if (me !== undefined) {
      if (me !== null) {
        const hasAuthority = (authority === "admin") ? me.authority === "admin" : true;
        if (hasAuthority) {
          next();
        } else {
          const body = CustomErrorCreator.ofType("notEnoughUserAuthority");
          response.status(403).send(body).end();
        }
      } else {
        response.status(401).end();
      }
    } else {
      next(new Error("cannot happen"));
    }
  } as any;
  return [beforeHandler, handler];
}