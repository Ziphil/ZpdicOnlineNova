//

import {NextFunction, Request, RequestHandler, Response} from "express";
import {MiddlewareBody} from "/server/controller/rest/internal/controller";
import {CustomErrorCreator} from "/server/creator/error";
import {DictionaryAuthority, DictionaryModel} from "/server/model";


export function parseDictionary(): RequestHandler {
  const handler = async function (request: Request & {middlewareBody: MiddlewareBody}, response: Response, next: NextFunction): Promise<void> {
    try {
      const identifier = request.body.identifier ?? request.body.number ?? request.body.paramName;
      if (identifier !== undefined) {
        const dictionary = await DictionaryModel.fetchOneByIdentifier(identifier);
        request.middlewareBody.dictionary = dictionary;
      } else {
        request.middlewareBody.dictionary = null;
      }
      next();
    } catch (error) {
      next(error);
    }
  } as any;
  return handler;
}

/** リクエストされた辞書に対してログイン中のユーザーに権限があるか調べ、権限がある場合にのみ、次の処理を行うようにします。
 * そもそも辞書が存在しない場合は、`noSuchDictionary` 400 エラーを返して終了します。
 * 辞書は存在していても権限がない場合は、`notEnoughDictionaryAuthority` 403 エラーを返して終了します。*/
export function checkDictionary(authority?: DictionaryAuthority | "none"): Array<RequestHandler> {
  const beforeHandler = parseDictionary();
  const handler = async function (request: Request & {middlewareBody: MiddlewareBody}, response: Response, next: NextFunction): Promise<void> {
    try {
      const me = request.middlewareBody.me;
      const dictionary = request.middlewareBody.dictionary;
      if (dictionary !== undefined) {
        if (dictionary !== null) {
          const hasAuthority = (me !== null && me !== undefined) ? await dictionary.hasAuthority(me, authority ?? "none") : true;
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
        next(new Error("cannot happen"));
      }
    } catch (error) {
      next(error);
    }
  } as any;
  return [beforeHandler, handler];
}