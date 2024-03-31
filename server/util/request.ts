//

import {Request, Response} from "express";


export function jsonifyRequest(request: Request, response?: Response): object {
  const method = request.method;
  const status = response?.statusCode;
  const path = request.baseUrl + request.path;
  const query = request.query;
  const body = ("password" in request.body) ? {...request.body, password: "***"} : request.body;
  return {path, method, status, query, body};
}