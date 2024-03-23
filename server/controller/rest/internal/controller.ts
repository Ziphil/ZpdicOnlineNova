//

import {
  Params as ExpressParams,
  Request as ExpressRequest,
  Response as ExpressResponse
} from "express-serve-static-core";
import {RestController as BaseRestController} from "/server/controller/rest/controller";
import {CustomErrorCreator} from "/server/creator/error";
import {CustomError, Dictionary, User} from "/server/model";
import {
  ErrorResponseType,
  ProcessName,
  RequestData,
  ResponseData,
  SuccessResponseData
} from "/server/type/internal";


export class RestController extends BaseRestController {

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


export interface MiddlewareBody {

  /** ログイン中のユーザーデータです。
   * このプロパティは、`parseMe`, `login` ミドルウェアが呼び出された場合にのみ、値が格納されます。*/
  me?: User | null;

  /** リクエストに関連する辞書データです。
   * このプロパティは、`parseDictionary` ミドルウェアが呼び出された場合にのみ、値が格納されます。*/
  dictionary?: Dictionary | null;

  /** ログイン処理の結果として得られた JSON トークンです。
   * このプロパティは、`login` ミドルウェアが呼び出された場合にのみ、値が格納されます。*/
  token?: string;

  /** reCAPTCHA が返したスコアが格納されます。
   * このプロパティは、`parseRecaptcha` ミドルウェアが呼び出された場合にのみ、値が格納されます。*/
  recaptchaScore?: number | null;

}


export type FilledMiddlewareBody<K extends keyof MiddlewareBody> = Required<MiddlewareBody> & {[P in K]-?: NonNullable<MiddlewareBody[P]>};

export type Request<N extends ProcessName> = ExpressRequest<ExpressParams, ResponseData<N>, RequestData<N>, never> & {middlewareBody: Required<MiddlewareBody>};
export type Response<N extends ProcessName> = ExpressResponse<ResponseData<N>, never>;