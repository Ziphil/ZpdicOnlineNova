//

import {
  Params as ExpressParams,
  Request as ExpressRequest,
  Response as ExpressResponse
} from "express-serve-static-core";
import {Controller as BaseController} from "/server/controller/controller";
import {CustomErrorCreator} from "/server/creator/error";
import {CustomError, Dictionary, User} from "/server/model";
import {
  ErrorResponseType,
  ProcessName,
  RequestData,
  ResponseData,
  SuccessResponseData
} from "/server/type/internal";


export class Controller extends BaseController {

  protected static respond<N extends ProcessName>(response: Response<N>, body: SuccessResponseData<N>): void {
    response.json(body).end();
  }

  /** 指定されたタイプの `CustomError` オブジェクトをレスポンスとして送ります。
   * ステータスコードは常に 400 です。 */
  protected static respondError<N extends ProcessName>(response: Response<N>, type: ErrorResponseType<N>): void {
    const body = CustomErrorCreator.ofType(type);
    response.status(400).json(body).end();
  }

  protected static respondForbiddenError<N extends ProcessName>(response: Response<N>): void {
    response.status(403).end();
  }

  /** `error` に指定された値が `CustomError` オブジェクトであり、そのタイプが `acceptedType` に含まれていた場合に限り、その `CustomError` オブジェクトをレスポンスとして送ります。
   * それ以外の場合は、`error` を例外として投げます。*/
  protected static respondByCustomError<N extends ProcessName, T extends ErrorResponseType<N>>(response: Response<N>, acceptedType: Array<T>, error: unknown): void {
    if (CustomError.isCustomError(error)) {
      const type = error.type as T;
      if (acceptedType.includes(type)) {
        const body = CustomErrorCreator.ofType(type);
        response.status(400).json(body).end();
      } else {
        throw error;
      }
    } else {
      throw error;
    }
  }

}


export interface Request<N extends ProcessName> extends ExpressRequest<ExpressParams, ResponseData<N>, RequestData<N>, never> {

  /** GET リクエストの際のクエリ文字列をパースした結果です。
   * 内部処理に使う API は全て POST リクエストのみ受け付けるようになっているので、`never` 型を指定してあります。*/
  query: never;

  /** POST リクエストの際のリクエストボディをパースした結果です。
   * 型安全性のため、別ファイルの型定義に従って Express が定まる型より狭い型を指定してあります。*/
  body: RequestData<N>;

  /** ユーザーの検証の結果として得られた JSON トークンが格納されます。
   * このプロパティは、`login` ミドルウェアが呼び出された場合にのみ、値が格納されます。*/
  token?: string;

  /** 認証に成功した場合にユーザーデータが格納されます。
   * このプロパティは、`authenticate` ミドルウェアおよび `verifyUser` ミドルウェアが呼び出された場合にのみ、値が格納されます。*/
  me?: User;

  /** ユーザ－に辞書の編集権限があった場合に辞書データが格納されます。
   * このプロパティは、`verifyDictionary` ミドルウェアが呼び出された場合にのみ、値が格納されます。*/
  dictionary?: Dictionary;

  /** reCAPTCHA が返したスコアが格納されます。
   * このプロパティは、`verifyRecaptcha` ミドルウェアが呼び出された場合にのみ、値が格納されます。*/
  recaptchaScore?: number;

  middlewareBody: MiddlewareBody;

}


export interface Response<N extends ProcessName> extends ExpressResponse<ResponseData<N>, never> {

}


export interface MiddlewareBody {

  /** ログイン中のユーザーデータです。
    * ログインに成功している場合は、ユーザーデータが格納されます。
    * ログインに失敗している場合は、`null` が格納されます。*/
  me?: User | null;

  /** リクエストに関連する辞書データです。
    * このプロパティは、`verifyDictionary` ミドルウェアが呼び出された場合にのみ、値が格納されます。*/
  dictionary?: Dictionary | null;

  /** ログイン処理の結果として得られた JSON トークンです。*/
  token?: string;

  /** reCAPTCHA が返したスコアが格納されます。
    * このプロパティは、`verifyRecaptcha` ミドルウェアが呼び出された場合にのみ、値が格納されます。*/
  recaptchaScore?: number | null;

}