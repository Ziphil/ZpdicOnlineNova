//

import {
  NextFunction,
  Request,
  Response,
  Router
} from "express";


export function checkSession(request: Request, response: Response, next: NextFunction): void {
  let session = request.session;
  if (session && session.name) {
    next();
  } else {
    response.redirect("/");
  }
}