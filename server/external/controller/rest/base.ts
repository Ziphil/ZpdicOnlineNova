//

import {ParamsDictionary as ExpressParamsDictionary, Request as ExpressRequest, Response as ExpressResponse} from "express-serve-static-core";
import {RestController} from "/server/controller/rest/controller";
import {ProcessName, RequestData, ResponseData} from "/server/external/type/rest";
import {Dictionary, User} from "/server/model";


export class ExternalRestController extends RestController {

}


export interface MiddlewareBody {

  /** ログイン中のユーザーデータです。
   * このプロパティは、`parseMe`, `login` ミドルウェアが呼び出された場合にのみ、値が格納されます。*/
  me?: User | null;

  /** リクエストに関連する辞書データです。
     * このプロパティは、`parseDictionary` ミドルウェアが呼び出された場合にのみ、値が格納されます。*/
  dictionary?: Dictionary | null;

}


export type Request<N extends ProcessName> = ExpressRequest<ExpressParamsDictionary, ResponseData<N>, RequestData<N>, RequestData<N>> & {middlewareBody: Required<MiddlewareBody>};
export type Response<N extends ProcessName> = ExpressResponse<ResponseData<N>, never>;

export type FilledMiddlewareBody<K extends keyof MiddlewareBody> = Required<MiddlewareBody> & {[P in K]-?: NonNullable<MiddlewareBody[P]>};
export type FilledRequest<N extends ProcessName, K extends keyof MiddlewareBody> = Request<N> & {middlewareBody: {[P in K]-?: NonNullable<MiddlewareBody[P]>}};
