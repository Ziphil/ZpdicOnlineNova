//

import {
  NextFunction,
  Request,
  Response,
  Router
} from "express";
import {
  PathParams
} from "express-serve-static-core";


export abstract class BaseController {

  public router: Router;
  public path: PathParams;

  public constructor(path: PathParams) {
    this.router = Router();
    this.path = path;
    this.setup();
  }

  protected abstract setup(): void;

  protected checkSession(request: Request, response: Response, next: NextFunction): void {
    let session = request.session;
    if (session && session.name) {
      next();
    } else {
      response.redirect("/");
    }
  }

}