//

import {
  NextFunction,
  Params,
  ParamsDictionary,
  Request,
  RequestHandler,
  Response
} from "express-serve-static-core";
import "reflect-metadata";
import {
  Controller
} from "/server/controller/controller";


const KEY = Symbol("controller");

type Metadata = Array<RequestHandlerSpec>;
type MethodType = "get" | "post";
type RequestHandlerSpec = {
  name: string | symbol,
  path: string;
  method: MethodType;
  befores: Array<RequestHandler<any>>;
  afters: Array<RequestHandler<any>>;
};

export function controller(path: string): ClassDecorator {
  let decorator = function (clazz: Function): void {
    let originalSetup = clazz.prototype.setup;
    clazz.prototype.setup = function (this: Controller): void {
      let anyThis = this as any;
      let array = Reflect.getMetadata(KEY, clazz.prototype) as Metadata;
      for (let metadata of array) {
        let handler = function (request: Request, response: Response, next: NextFunction): void {
          Promise.resolve(anyThis[metadata.name](request, response, next)).catch((error) => {
            next(error);
          });
        };
        this.router[metadata.method](metadata.path, ...metadata.befores, handler, ...metadata.afters);
      }
      this.path = path;
      originalSetup();
    };
  };
  return decorator;
}

export function get(path: string): MethodDecorator {
  let decorator = function (target: object, name: string | symbol, descriptor: PropertyDescriptor): void {
    setPath(target, name, "get", path);
  };
  return decorator;
}

export function post(path: string): MethodDecorator {
  let decorator = function (target: object, name: string | symbol, descriptor: PropertyDescriptor): void {
    setPath(target, name, "post", path);
  };
  return decorator;
}

export function before<P extends Params = ParamsDictionary>(...middlewares: Array<RequestHandler<P>>): MethodDecorator {
  let decorator = function (target: object, name: string | symbol, descriptor: PropertyDescriptor): void {
    pushMiddlewares(target, name, "before", ...middlewares);
  };
  return decorator;
}

export function after<P extends Params = ParamsDictionary>(...middlewares: Array<RequestHandler<P>>): MethodDecorator {
  let decorator = function (target: object, name: string | symbol, descriptor: PropertyDescriptor): void {
    pushMiddlewares(target, name, "after", ...middlewares);
  };
  return decorator;
}

function findControllerSpec(target: object, name: string | symbol): RequestHandlerSpec {
  let metadata = Reflect.getMetadata(KEY, target) as Metadata;
  if (!metadata) {
    metadata = [];
    Reflect.defineMetadata(KEY, metadata, target);
  }
  let spec = metadata.find((candidate) => candidate.name === name);
  if (spec === undefined) {
    spec = {name, path: "/", method: "get", befores: [], afters: []};
    metadata.push(spec);
  }
  return spec;
}

function setPath(target: object, name: string | symbol, method: MethodType, path: string): void {
  let metadata = findControllerSpec(target, name);
  metadata.method = method;
  metadata.path = path;
}

function pushMiddlewares<P extends Params = ParamsDictionary>(target: object, name: string | symbol, timing: string, ...middlewares: Array<RequestHandler<P>>): void {
  let metadata = findControllerSpec(target, name);
  if (timing === "before") {
    metadata.befores.push(...middlewares);
  } else if (timing === "after") {
    metadata.afters.push(...middlewares);
  }
}