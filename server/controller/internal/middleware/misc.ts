//

import {NextFunction, Request, RequestHandler, Response} from "express";
import {MiddlewareBody} from "/server/controller/internal/controller";
import {CustomErrorCreator} from "/server/creator/error";
import {LogUtil} from "/server/util/log";
import {RecaptchaUtil} from "/server/util/recaptcha";


export function parseRecaptcha(): RequestHandler {
  const handler = async function (request: Request & {middlewareBody: MiddlewareBody}, response: Response, next: NextFunction): Promise<void> {
    const recaptchaToken = request.query.recaptchaToken || request.body.recaptchaToken;
    try {
      const result = await RecaptchaUtil.verify(recaptchaToken);
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
      next("cannot happen");
    }
  } as any;
  return [beforeHandler, handler];
}