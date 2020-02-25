//

import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router
} from "express";
import * as passport from "passport";
import {
  UserDocument
} from "../model/user";


export function checkLogin(redirect: string): RequestHandler {
  let handler = function (request: Request, response: Response, next: NextFunction): void {
    if (request.isAuthenticated()) {
      return next();
    } else {
      response.redirect(redirect);
    }
  };
  return handler;
}

export function authenticate(redirect: string): RequestHandler {
  let handler = passport.authenticate("local", {failureRedirect: redirect});
  return handler;
}