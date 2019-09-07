//

import {
  Express,
  NextFunction,
  Request,
  Response,
  Router
} from "express";
import {
  PathParams
} from "express-serve-static-core";


export abstract class BaseController {

  protected router: Router;
  protected path: PathParams;

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

  // このクラスを継承したクラスのインスタンスを生成し、引数として渡されたアプリケーションオブジェクトに対してルーターの設定を行います。
  // このときに生成したインスタンスを返します。
  public static use<C extends BaseController>(this: new() => C, application: Express): C {
    let controller = new this();
    application.use(controller.path, controller.router);
    return controller;
  }

}