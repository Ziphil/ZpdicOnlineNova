//

import {NextFunction, Request, RequestHandler, Response} from "express";
import {MiddlewareBody} from "/server/controller/internal/controller";
import {CustomErrorCreator} from "/server/creator/error";
import {DictionaryAuthority, DictionaryModel} from "/server/model";


export function parseDictionary(): RequestHandler {
  const handler = async function (request: Request & {middlewareBody: MiddlewareBody}, response: Response, next: NextFunction): Promise<void> {
    try {
      const identifier = request.body.identifier ?? request.body.number ?? request.body.paramName;
      const dictionary = await DictionaryModel.fetchOneByIdentifier(identifier);
      request.middlewareBody.dictionary = dictionary;
      next();
    } catch (error) {
      next(error);
    }
  } as any;
  return handler;
}

/** リクエストされた辞書に対してログイン中のユーザーが権限をもっているか調べ、権限をもっている場合にのみ、次の処理を行うようにします。
 * そもそも辞書が存在しない場合は、`noSuchDictionary` エラーを返して終了します。
 * 辞書は存在していても権限をもっていない場合は、`notEnoughDictionaryAuthority` エラーを返して終了します。*/
export function checkDictionary(authority?: DictionaryAuthority): Array<RequestHandler> {
  const beforeHandler = parseDictionary();
  const handler = async function (request: Request & {middlewareBody: MiddlewareBody}, response: Response, next: NextFunction): Promise<void> {
    try {
      const me = request.middlewareBody.me;
      const dictionary = request.middlewareBody.dictionary;
      if (me !== undefined && dictionary !== undefined) {
        if (dictionary !== null) {
          const hasAuthority = (me !== null) ? await dictionary.hasAuthority(me, authority ?? "none") : true;
          if (hasAuthority) {
            next();
          } else {
            const body = CustomErrorCreator.ofType("notEnoughDictionaryAuthority");
            response.status(403).send(body).end();
          }
        } else {
          const body = CustomErrorCreator.ofType("noSuchDictionary");
          response.status(400).send(body).end();
        }
      } else {
        next("cannot happen");
      }
    } catch (error) {
      next(error);
    }
  } as any;
  return [beforeHandler, handler];
}