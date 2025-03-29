//

import {NextFunction, Request, RequestHandler, Response} from "express";
import {rateLimit} from "express-rate-limit";
import {MiddlewareBody} from "/server/external/controller/rest/base";


const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false
});

/** リクエストに呼び出し制限をかけます。
 * 同じユーザーから 1 分間に 5 回より多く呼び出された場合、429 エラーを終了します。*/
export function limit(): RequestHandler {
  const handler = async function (request: Request & {middlewareBody: MiddlewareBody}, response: Response, next: NextFunction): Promise<void> {
    try {
      limiter(request, response, next);
    } catch (error) {
      next(error);
    }
  } as any;
  return handler;
}