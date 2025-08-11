//

import {NextFunction, Request, RequestHandler, Response} from "express";
import {ValidationError} from "yup";
import {ProcessName, SERVER_SCHEMATA} from "/server/external-alpha/type/rest";


export function validateQuery<N extends ProcessName>(name: N): RequestHandler {
  const schema = SERVER_SCHEMATA[name].request.query;
  const handler = async function (request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const data = await schema.validate(request.query);
      request.query = data as unknown as Record<string, string>;
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        response.status(400).json({error: "invalidRequest", message: error.message}).end();
      } else {
        next(error);
      }
    }
  };
  return handler;
}

export function validateBody<N extends ProcessName>(name: N): RequestHandler {
  const schema = SERVER_SCHEMATA[name].request.body;
  const handler = async function (request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const data = await schema.validate(request.body);
      request.body = data;
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        response.status(400).json({error: "invalidRequest", message: error.message}).end();
      } else {
        next(error);
      }
    }
  };
  return handler;
}