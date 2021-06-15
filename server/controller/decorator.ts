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


class ControllerMetadata<P extends Params = ParamsDictionary> {

  public name: string | symbol;
  public path: string = "/";
  public method: MethodType = "get";
  public befores: Array<RequestHandler<P>> = [];
  public afters: Array<RequestHandler<P>> = [];

  public constructor(name: string | symbol) {
    this.name = name;
  }

}


export function controller<P extends Params = ParamsDictionary>(path: string): ClassDecorator {
  let decorator = function (clazz: Function): void {
    let originalSetup = clazz.prototype.setup;
    clazz.prototype.setup = function (this: Controller): void {
      let anyThis = this as any;
      let array = getMetadataArray<P>(clazz.prototype);
      for (let metadata of array) {
        let handler = function (request: Request<P>, response: Response, next: NextFunction): void {
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

const KEY = Symbol("controller");

function findMetadata<P extends Params = ParamsDictionary>(target: object, name: string | symbol): ControllerMetadata<P> {
  let array = Reflect.getMetadata(KEY, target);
  if (!array) {
    array = [];
    Reflect.defineMetadata(KEY, array, target);
  }
  let metadata = null;
  for (let candidate of array) {
    if (candidate.name === name) {
      metadata = candidate;
    }
  }
  if (!metadata) {
    metadata = new ControllerMetadata<P>(name);
    array.push(metadata);
  }
  return metadata;
}

function setPath(target: object, name: string | symbol, method: MethodType, path: string): void {
  let metadata = findMetadata(target, name);
  metadata.method = method;
  metadata.path = path;
}

function pushMiddlewares<P extends Params = ParamsDictionary>(target: object, name: string | symbol, timing: string, ...middlewares: Array<RequestHandler<P>>): void {
  let metadata = findMetadata<P>(target, name);
  if (timing === "before") {
    metadata.befores.push(...middlewares);
  } else if (timing === "after") {
    metadata.afters.push(...middlewares);
  }
}

function getMetadataArray<P extends Params = ParamsDictionary>(target: object): Array<ControllerMetadata<P>> {
  let array = Reflect.getMetadata(KEY, target);
  return array;
}

type MethodType = "get" | "post";