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
  ProcessName,
  RequestData,
  ResponseData,
  ResponseEachData
} from "/server/controller/interface/type";
import {
  Dictionary
} from "/server/model/dictionary";
import {
  User
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

  protected static respond<N extends ProcessName>(response: Response<N>, body: ResponseEachData<N, "success">): void {
    response.json(body).end();
  }

  // ステータスコード 400 でレスポンスボディを送ります。
  // 第 3 引数の error が指定された場合のみ、body として undefined を渡すのが許されます。
  // この場合は、body が undefined ならば error を例外として投げ、そうでないならば通常通り body をレスポンスとして送ります。
  protected static respondError<N extends ProcessName>(response: Response<N>, body: ResponseEachData<N, "error">): void;
  protected static respondError<N extends ProcessName>(response: Response<N>, body: ResponseEachData<N, "error"> | undefined, error: any): void;
  protected static respondError<N extends ProcessName>(response: Response<N>, body: ResponseEachData<N, "error"> | undefined, error?: any): void {
    if (body !== undefined) {
      response.status(400).json(body).end();
    } else if (error !== undefined) {
      throw error;
    }
  }

  protected static respondForbidden<N extends ProcessName>(response: Response<N>): void {
    response.status(403).end();
  }

  // このクラスを継承したクラスのインスタンスを生成し、引数として渡されたアプリケーションオブジェクトに対してルーターの設定を行います。
  // このときに生成したインスタンスを返します。
  public static use<C extends Controller>(this: new() => C, application: Express): C {
    let controller = new this();
    application.use(controller.path, controller.router);
    return controller;
  }

}


export interface Request<N extends ProcessName> extends ExpressRequest<ExpressParams, ResponseData<N>, RequestData<N>, any> {

  // GET リクエストの際のクエリ文字列をパースした結果です。
  // 内部処理に使う API は全て POST リクエストのみ受け付けるようになっているので、never 型を指定してあります。
  query: never;

  // POST リクエストの際のリクエストボディをパースした結果です。
  // 型安全性のため、別ファイルの型定義に従って Express が定まる型より狭い型を指定してあります。
  body: RequestData<N>;

  // ユーザーの検証の結果として得られた JSON トークンが格納されます。
  // このプロパティは、authenticate ミドルウェアが呼び出された場合にのみ、値が格納されます。
  token?: string;

  // 認証に成功した場合にユーザーデータが格納されます。
  // このプロパティは、authenticate ミドルウェアおよび verifyUser ミドルウェアが呼び出された場合にのみ、値が格納されます。
  user?: User;

  // ユーザ－に辞書の編集権限があった場合に辞書データが格納されます。
  // このプロパティは、verifyDictionary ミドルウェアが呼び出された場合にのみ、値が格納されます。
  dictionary?: Dictionary;

  // reCAPTCHA が返したスコアが格納されます。
  // このプロパティは、verifyRecaptcha ミドルウェアが呼び出された場合にのみ、値が格納されます。
  recaptchaScore?: number;

}


export interface Response<N extends ProcessName> extends ExpressResponse<ResponseData<N>> {

}