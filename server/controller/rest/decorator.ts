//

import {Router} from "express";
import {NextFunction, Request, RequestHandlerParams, Response} from "express-serve-static-core";
import "reflect-metadata";
import {Controller} from "/server/controller/controller";


const REST_METADATA_KEY = Symbol("rest");

type RestMetadata = Array<RequestHandlerSpec>;
type RequestHandlerSpec = {
  key: string | symbol,
  path: string,
  method: "get" | "post",
  befores: Array<RequestHandlerParams<any>>,
  afters: Array<RequestHandlerParams<any>>
};

export function restController(path: string): ClassDecorator {
  const decorator = function (clazz: Function): void {
    const metadata = Reflect.getMetadata(REST_METADATA_KEY, clazz.prototype) as RestMetadata;
    const originalSetup = clazz.prototype.setup;
    clazz.prototype.setup = function (this: Controller): void {
      const router = Router();
      for (const spec of metadata) {
        const outerThis = this as any;
        const handler = function (request: Request, response: Response, next: NextFunction): void {
          Promise.resolve(outerThis[spec.key](request, response, next)).catch((error) => {
            next(error);
          });
        };
        router[spec.method](spec.path, ...spec.befores, handler, ...spec.afters);
      }
      this.application.use(path, router);
      this.router = router;
      this.restConfig = {path};
      originalSetup.call(this);
    };
  };
  return decorator;
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