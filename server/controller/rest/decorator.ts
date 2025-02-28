//

import "reflect-metadata";
import {Router} from "express";
import {NextFunction, Request, RequestHandlerParams, Response} from "express-serve-static-core";
import {RestController} from "/server/controller/rest/controller";


const REST_METADATA_KEY = Symbol("rest");

type RestMetadata = Array<RequestHandlerSpec>;
type RequestHandlerSpec = {
  key: string | symbol,
  path: string,
  method: "get" | "post",
  befores: Array<RequestHandlerParams<any>>,
  afters: Array<RequestHandlerParams<any>>
};

export function restController(restPath: string, socketPath?: string): ClassDecorator {
  const decorator = function (clazz: typeof RestController): void {
    const metadata = (Reflect.getMetadata(REST_METADATA_KEY, clazz.prototype) ?? []) as RestMetadata;
    const originalPrepare = clazz.prepare;
    const originalSetup = clazz.prototype.setup;
    clazz.prepare = function (this: typeof RestController, application: any, server: any, agenda: any): void {
      originalPrepare.call(this, application, server, agenda);
      this.router = Router();
      this.namespace = (socketPath !== undefined) ? server.of(socketPath) : undefined;
    };
    clazz.prototype.setup = function (this: RestController): void {
      originalSetup.call(this);
      const constructor = this.constructor as typeof RestController;
      for (const spec of metadata) {
        const method = (this as any)[spec.key].bind(this);
        const handler = function (request: Request, response: Response, next: NextFunction): void {
          Promise.resolve(method(request, response, next)).catch((error) => {
            next(error);
          });
        };
        constructor.router[spec.method](spec.path, ...spec.befores, handler, ...spec.afters);
      }
      constructor.application.use(restPath, constructor.router);
    };
  };
  return decorator as any;
}

export function get(path: string): MethodDecorator {
  const decorator = function (target: object, key: string | symbol, descriptor: PropertyDescriptor): void {
    setPath(target, key, "get", path);
  };
  return decorator;
}

export function post(path: string): MethodDecorator {
  const decorator = function (target: object, key: string | symbol, descriptor: PropertyDescriptor): void {
    setPath(target, key, "post", path);
  };
  return decorator;
}

export function before(...middlewares: Array<RequestHandlerParams>): MethodDecorator {
  const decorator = function (target: object, key: string | symbol, descriptor: PropertyDescriptor): void {
    pushMiddlewares(target, key, "before", ...middlewares);
  };
  return decorator;
}

export function after(...middlewares: Array<RequestHandlerParams>): MethodDecorator {
  const decorator = function (target: object, key: string | symbol, descriptor: PropertyDescriptor): void {
    pushMiddlewares(target, key, "after", ...middlewares);
  };
  return decorator;
}

function setPath(target: object, key: string | symbol, method: "get" | "post", path: string): void {
  const spec = findHandlerSpec(target, key);
  spec.method = method;
  spec.path = path;
}

function pushMiddlewares(target: object, key: string | symbol, timing: string, ...middlewares: Array<RequestHandlerParams>): void {
  const spec = findHandlerSpec(target, key);
  if (timing === "before") {
    spec.befores.push(...middlewares);
  } else if (timing === "after") {
    spec.afters.push(...middlewares);
  }
}

function findHandlerSpec(target: object, key: string | symbol): RequestHandlerSpec {
  let metadata = Reflect.getMetadata(REST_METADATA_KEY, target) as RestMetadata;
  if (!metadata) {
    metadata = [];
    Reflect.defineMetadata(REST_METADATA_KEY, metadata, target);
  }
  let spec = metadata.find((spec) => spec.key === key);
  if (spec === undefined) {
    spec = {key, path: "/", method: "get", befores: [], afters: []};
    metadata.push(spec);
  }
  return spec;
}