//

import {NextFunction, Request, RequestHandler, Response} from "express";
import {MiddlewareBody} from "/server/internal/controller/rest/base";
import {UserModel} from "/server/model";


/** リクエストヘッダーに書き込まれた API キーを検証します。
  * 検証に成功した場合は、リクエストオブジェクトの `me` プロパティにユーザーオブジェクトを書き込みます。
  * 検証に失敗した場合は、リクエストオブジェクトの `me` プロパティに `null` を書き込みます。*/
export function parseMe(): RequestHandler {
  const handler = async function (request: Request & {middlewareBody: MiddlewareBody}, response: Response, next: NextFunction): Promise<void> {
    const apiKey = request.headers["x-api-key"];
    try {
      if (apiKey !== undefined && typeof apiKey === "string") {
        const me = await UserModel.findOne().where("apiKey", apiKey).exec();
        request.middlewareBody.me = me;
      } else {
        request.middlewareBody.me = null;
      }
      next();
    } catch (error) {
      next(error);
    }
  } as any;
  return handler;
}

/** API キーの検証情報を利用して、正しい API キーが指定されている場合にのみ、次の処理を行うようにします。
  * 正しい API キーが指定されていない場合は、401 エラーを返して終了します。
  * 正しい API キーが指定されていても指定された権限がない場合は、403 エラーを返して終了します。*/
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
          response.status(403).json({error: "notEnoughUserAuthority"}).end();
        }
      } else {
        response.status(401).json({error: "invalidApiKey"}).end();
      }
    } else {
      next(new Error("cannot happen"));
    }
  } as any;
  return [beforeHandler, handler];
}