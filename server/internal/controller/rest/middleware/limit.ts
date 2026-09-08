//

import {RequestHandler} from "express";
import {rateLimit} from "express-rate-limit";
import {CustomErrorCreator} from "/server/internal/creator/error";


/** ログイン中のユーザーごとに、単位時間あたりのリクエスト回数を制限します。
  * 回数が上限を超えた場合は、`rateLimitExceeded` 429 エラーを返して終了します。
  * ユーザーごとに回数を数えるため、必ず `checkMe` ミドルウェアより後に指定してください。*/
export function checkRateLimit(spec: {limit: number, windowInMinute: number}): RequestHandler {
  const handler = rateLimit({
    windowMs: spec.windowInMinute * 60 * 1000,
    limit: spec.limit,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (request, response) => {
      const castRequest = request as any;
      const me = castRequest.middlewareBody.me;
      if (me !== undefined && me !== null) {
        return me.id;
      } else {
        return "anonymous";
      }
    },
    handler: (request, response, next, options) => {
      const body = CustomErrorCreator.ofType("rateLimitExceeded");
      response.status(429).send(body).end();
    }
  });
  return handler;
}
