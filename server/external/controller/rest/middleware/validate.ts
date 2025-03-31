//

import {NextFunction, Request, RequestHandler, Response} from "express";
import {ValidationError} from "yup";
import {ProcessName, SERVER_SCHEMATA} from "/server/external/type/rest";


export function validateQuery<N extends ProcessName>(name: N): RequestHandler {
  const schema = SERVER_SCHEMATA[name].request;
  const handler = async function (request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const data = await schema.validate(request.query);
      request.query = data as any;
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        response.status(400).json({error: error.message}).end();
      } else {
        next(error);
      }
    }
  };
  return handler;
}

export function validateBody<N extends ProcessName>(name: N): RequestHandler {
  const schema = SERVER_SCHEMATA[name].request;
  const handler = async function (request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const data = await schema.validate(request.body);
      request.body = data;
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        response.status(400).json({error: error.message}).end();
      } else {
        next(error);
      }
    }
  };
  return handler;
}