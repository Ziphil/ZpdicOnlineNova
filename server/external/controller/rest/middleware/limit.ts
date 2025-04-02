//

import {NextFunction, Request, RequestHandler, Response} from "express";
import {rateLimit} from "express-rate-limit";
import {MiddlewareBody} from "/server/external/controller/rest/base";


const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (request, response, next, options) => {
    response.status(429).json({error: "rateLimitExceeded"}).end();
  },
  keyGenerator: (request, response) => {
    const apiKey = request.headers["x-api-key"];
    if (apiKey !== undefined && typeof apiKey === "string") {
      return apiKey;
    } else {
      return "anonymous";
    }
  }
});

/** リクエストに呼び出し制限をかけます。
 * 同じ API キーを用いて 1 分間に 10 回より多く呼び出された場合、429 エラーを返して終了します。*/
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