//

import {ParamsDictionary as ExpressParamsDictionary, Request as ExpressRequest, Response as ExpressResponse} from "express-serve-static-core";
import {RestController} from "/server/controller/rest/controller";
import {ProcessName, RequestData, ResponseCode, ResponseData} from "/server/external-alpha/type/rest";
import {CustomError, Dictionary, LimitErrorTypeUtil, User} from "/server/model";


export class ExternalRestController extends RestController {

  protected static respond<N extends ProcessName, T extends ResponseCode>(response: Response<N>, status: T, body: ResponseData<N, T>): void {
    response.status(status).json(body as any).end();
  }

  /** `error` に指定された値がデータの上限を超えたことを表す `CustomError` オブジェクトであった場合に限り、そのタイプをステータスコード 400 のレスポンスとして送ります。
   * それ以外の場合は、`error` を例外として投げます。*/
  protected static respondByLimitError<N extends ProcessName>(response: Response<N>, error: unknown): void {
    if (CustomError.isCustomError(error) && LimitErrorTypeUtil.is(error.type)) {
      this.respond(response, 400, {error: error.type});
    } else {
      throw error;
    }
  }

}


export interface MiddlewareBody {

  /** ログイン中のユーザーデータです。
   * このプロパティは、`parseMe`, `login` ミドルウェアが呼び出された場合にのみ、値が格納されます。*/
  me?: User | null;

  /** リクエストに使用された API キーに設定された、1 分あたりの呼び出し回数の上限です。
   * このプロパティは、`parseMe` ミドルウェアが呼び出された場合にのみ、値が格納されます。
   * 有効な API キーが指定されなかった場合は `null` になります。*/
  limit?: number | null;

  /** リクエストに関連する辞書データです。
   * このプロパティは、`parseDictionary` ミドルウェアが呼び出された場合にのみ、値が格納されます。*/
  dictionary?: Dictionary | null;

}


export type Request<N extends ProcessName> = ExpressRequest<ExpressParamsDictionary, ResponseData<N, ResponseCode>, RequestData<N, "body">, RequestData<N, "query">> & {middlewareBody: Required<MiddlewareBody>};
export type Response<N extends ProcessName> = ExpressResponse<ResponseData<N, ResponseCode>, never>;

export type FilledMiddlewareBody<K extends keyof MiddlewareBody> = Required<MiddlewareBody> & {[P in K]-?: NonNullable<MiddlewareBody[P]>};
export type FilledRequest<N extends ProcessName, K extends keyof MiddlewareBody> = Request<N> & {middlewareBody: {[P in K]-?: NonNullable<MiddlewareBody[P]>}};
