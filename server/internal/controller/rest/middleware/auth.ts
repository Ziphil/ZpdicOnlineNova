//

import {NextFunction, Request, RequestHandler, Response} from "express";
import {MiddlewareBody} from "/server/internal/controller/rest/controller";
import {UserModel} from "/server/model";
import {signJwt} from "/server/util/jwt";


/** リクエストの内容からログイン認証用のトークンを生成します。
 * 引数として、トークンの有効期限 (秒単位) を受け取ります。
 * ログインに成功した場合 (該当するユーザーが存在した場合) は、リクエストオブジェクトの `token`, `me` プロパティに情報を書き込み、次の処理を行います。
 * ログインに失敗した場合、ステータスコード 401 を返して終了します。*/
export function login(expiresIn: number): RequestHandler {
  const handler = async function (request: Request & {middlewareBody: MiddlewareBody}, response: Response, next: NextFunction): Promise<void> {
    const {name, password} = request.body;
    const me = await UserModel.authenticate(name, password);
    if (me) {
      try {
        const token = await signJwt({id: me.id}, {expiresIn});
        request.middlewareBody.token = token;
        request.middlewareBody.me = me;
        response.cookie("authorization", token, {maxAge: expiresIn * 1000, httpOnly: true, signed: true, sameSite: true});
        next();
      } catch (error) {
        next(error);
      }
    } else {
      response.status(401).end();
    }
  };
  return handler as any;
}

export function logout(): RequestHandler {
  const handler = async function (request: Request, response: Response, next: NextFunction): Promise<void> {
    response.clearCookie("authorization");
    next();
  };
  return handler;
}