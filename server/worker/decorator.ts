//

import "reflect-metadata";
import {Worker} from "./worker";


const KEY = Symbol("worker");

type Metadata = Array<JobHandlerSpec>;
type JobHandlerSpec = {
  key: string | symbol,
  name: string
};

export function worker(): ClassDecorator {
  const decorator = function (clazz: Function): void {
    const originalSetup = clazz.prototype.setup;
    clazz.prototype.setup = function (this: Worker): void {
      const outerThis = this as any;
      const metadata = Reflect.getMetadata(KEY, clazz.prototype) as Metadata;
      for (const spec of metadata) {
        this.agenda.define(spec.name, async (job, done) => {
          await outerThis[spec.key](job);
          done();
        });
      }
      originalSetup.call(this);
    };
  };
  return decorator;
}

export function job(name: string): MethodDecorator {
  const decorator = function (target: object, key: string | symbol, descriptor: PropertyDescriptor): void {
    const metadata = getMetadata(target);
    metadata.push({key, name});
  };
  return decorator;
}

function getMetadata(target: object): Metadata {
  let metadata = Reflect.getMetadata(KEY, target) as Metadata;
  if (!metadata) {
    metadata = [];
    Reflect.defineMetadata(KEY, metadata, target);
  }
  return metadata;
}