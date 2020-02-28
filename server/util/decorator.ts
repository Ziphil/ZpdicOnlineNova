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
} from "../controller/controller";


interface ControllerMetadata<P extends Params = ParamsDictionary> {

  name: string | symbol;
  path: string;
  method: MethodType;
  befores: Array<RequestHandler<P>>;
  afters: Array<RequestHandler<P>>;

}


type MethodType = "get" | "post";

export function controller<P extends Params = ParamsDictionary>(path: string): ClassDecorator {
  let decorator = function (clazz: new() => Controller): void {
    let originalSetup = clazz.prototype.setup;
    clazz.prototype.setup = function (this: Controller): void {
      let anyThis = <any>this;
      let array = getMetadataArray<P>(clazz.prototype);
      for (let metadata of array) {
        let handler = function (request: Request<P>, response: Response, next: NextFunction): any {
          return anyThis[metadata.name](request, response, next);
        };
        this.router[metadata.method](metadata.path, ...metadata.befores, handler, ...metadata.afters);
      }
      this.path = path;
      originalSetup();
    };
  };
  return <any>decorator;
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
    metadata = {name, path: "/", method: "get", befores: [], afters: []};
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