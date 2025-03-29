//

import {NextFunction, Request, RequestHandler, Response} from "express";
import {MiddlewareBody} from "/server/internal/controller/rest/controller";
import {CustomErrorCreator} from "/server/internal/creator/error";
import {LogUtil} from "/server/util/log";
import {verifyRecaptcha} from "/server/util/recaptcha";


export function parseRecaptcha(): RequestHandler {
  const handler = async function (request: Request & {middlewareBody: MiddlewareBody}, response: Response, next: NextFunction): Promise<void> {
    const recaptchaToken = request.query.recaptchaToken || request.body.recaptchaToken;
    try {
      const result = await verifyRecaptcha(recaptchaToken);
      const score = result.score;
      const action = result.action;
      LogUtil.log("middle/verifyRecaptcha", {action, score});
      request.middlewareBody.recaptchaScore = result.score;
      next();
    } catch (error) {
      if (error.name === "CustomError" && error.type === "recaptchaError") {
        request.middlewareBody.recaptchaScore = null;
        next();
      } else {
        next(error);
      }
    }
  } as any;
  return handler;
}

/** reCAPTCHA の実行結果を利用して、人間による操作だと判断された場合にのみ、次の処理を行うようにします。
  * 人間による操作だと判断されなかった場合は、`recaptchaRejected` 403 エラーを返して終了します。
  * reCAPTCHA の実行に失敗した場合は、`recaptchaError` 403 エラーを返して終了します。*/
export function checkRecaptcha(): Array<RequestHandler> {
  const beforeHandler = parseRecaptcha();
  const handler = async function (request: Request & {middlewareBody: MiddlewareBody}, response: Response, next: NextFunction): Promise<void> {
    const recaptchaScore = request.middlewareBody.recaptchaScore;
    if (recaptchaScore !== undefined) {
      if (recaptchaScore !== null) {
        if (recaptchaScore >= 0.5) {
          next();
        } else {
          const body = CustomErrorCreator.ofType("recaptchaRejected");
          response.status(403).send(body).end();
        }
      } else {
        const body = CustomErrorCreator.ofType("recaptchaError");
        response.status(403).send(body).end();
      }
    } else {
      next(new Error("cannot happen"));
    }
  } as any;
  return [beforeHandler, handler];
}