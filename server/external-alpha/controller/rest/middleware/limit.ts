//

import {NextFunction, Request, RequestHandler, Response} from "express";
import {limiter} from "/server/controller/rest/limiter";
import {MiddlewareBody} from "/server/external-alpha/controller/rest/base";


/** リクエストに呼び出し制限をかけます。
 * 制限より多く呼び出された場合、429 エラーを返して終了します。
 * API キーに呼び出し制限が設定されていない場合は、データの不整合とみなし 500 エラーを返して終了します。*/
export function limit(): RequestHandler {
  const handler = async function (request: Request & {middlewareBody: MiddlewareBody}, response: Response, next: NextFunction): Promise<void> {
    try {
      const limitValue = request.middlewareBody.limit;
      if (typeof limitValue === "number") {
        limiter(request, response, next);
      } else {
        next(new Error("rateLimitNotConfigured"));
      }
    } catch (error) {
      next(error);
    }
  } as any;
  return handler;
}