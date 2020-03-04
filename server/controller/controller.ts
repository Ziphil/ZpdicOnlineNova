//

import {
  Express,
  Router
} from "express";
import {
  Params as ExpressParams,
  Request as ExpressRequest,
  Response as ExpressResponse
} from "express-serve-static-core";
import {
  RequestBody,
  RequestQuery,
  ResponseBody
} from "/server/controller/type";
import {
  UserDocument
} from "/server/model/user";


export class Controller {

  protected router: Router;
  protected path: string;

  public constructor() {
    this.router = Router();
    this.path = "/";
    this.setup();
  }

  protected setup(): void {
  }

  // このクラスを継承したクラスのインスタンスを生成し、引数として渡されたアプリケーションオブジェクトに対してルーターの設定を行います。
  // このときに生成したインスタンスを返します。
  public static use<C extends Controller>(this: new() => C, application: Express): C {
    let controller = new this();
    application.use(controller.path, controller.router);
    return controller;
  }

}


export interface Request<T extends keyof ResponseBody & keyof RequestBody & keyof RequestQuery> extends ExpressRequest<ExpressParams, ResponseBody[T], RequestBody[T]> {

  body: RequestBody[T];
  query: RequestQuery[T];
  user?: UserDocument;
  token?: string;

}


export interface Response<T extends keyof ResponseBody> extends ExpressResponse<ResponseBody[T]> {

}