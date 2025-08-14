//

import {NextFunction, Request, RequestHandler, Response} from "express";
import {limiter} from "/server/controller/rest/limiter";
import {MiddlewareBody} from "/server/external-preview/controller/rest/base";


/** リクエストに呼び出し制限をかけます。
 * 制限より多く呼び出された場合、429 エラーを返して終了します。*/
export function limit(): RequestHandler {
  const handler = async function (request: Request & {middlewareBody: MiddlewareBody}, response: Response, next: NextFunction): Promise<void> {
    try {
      const me = request.middlewareBody.me;
      if (me !== null && me !== undefined && me.authority === "admin") {
        next();
      } else {
        limiter(request, response, next);
      }
    } catch (error) {
      next(error);
    }
  } as any;
  return handler;
}