//

import {
  Router
} from "express";
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
} from "./class";


interface ControllerMetadata<P extends Params = ParamsDictionary> {

  method: "get" | "post";
  name: string;
  path: string;
  middlewares: Array<RequestHandler<P>>;

}


const KEY = Symbol("controller");

export function controller<P extends Params = ParamsDictionary>(path: string): ClassDecorator {
  let decorator = function (clazz: new() => Controller): void {
    let originalSetup = clazz.prototype.setup;
    clazz.prototype.setup = function (this: Controller): void {
      let anyThis = <any>this;
      let array = getMetadata<ControllerMetadata<P>>(clazz.prototype);
      for (let metadata of array) {
        let handler = function (request: Request<P>, response: Response, next: NextFunction): any {
          return anyThis[metadata.name](request, response, next);
        };
        this.router[metadata.method](metadata.path, ...metadata.middlewares, handler);
      }
      this.path = path;
      originalSetup();
    };
  };
  return <any>decorator;
}

export function get<P extends Params = ParamsDictionary>(path: string, ...middlewares: Array<RequestHandler<P>>): MethodDecorator {
  let decorator = function (target: object, name: string | symbol, descriptor: PropertyDescriptor): void {
    let metadata = {method: "get", name, path, middlewares};
    pushMetadata(target, metadata);
  };
  return decorator;
}

export function post<P extends Params = ParamsDictionary>(path: string, ...middlewares: Array<RequestHandler<P>>): MethodDecorator {
  let decorator = function (target: object, name: string | symbol, descriptor: PropertyDescriptor): void {
    let metadata = {method: "post", name, path, middlewares};
    pushMetadata(target, metadata);
  };
  return decorator;
}

function pushMetadata<M>(target: object, metadata: M): void {
  let array = Reflect.getMetadata(KEY, target);
  if (array) {
    array.push(metadata);
  } else {
    Reflect.defineMetadata(KEY, [metadata], target);
  }
}

function getMetadata<M>(target: object): M[] {
  let metadata = Reflect.getMetadata(KEY, target);
  return metadata;
}