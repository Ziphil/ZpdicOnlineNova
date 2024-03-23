//

import "reflect-metadata";
import {JobController} from "./controller";


const JOB_KEY = Symbol("worker");

type JobMetadata = Array<JobHandlerSpec>;
type JobHandlerSpec = {
  key: string | symbol,
  name: string
};

export function controller(): ClassDecorator {
  const decorator = function (clazz: Function): void {
    const originalSetup = clazz.prototype.setup;
    clazz.prototype.setup = function (this: JobController): void {
      const outerThis = this as any;
      const metadata = Reflect.getMetadata(JOB_KEY, clazz.prototype) as JobMetadata;
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

function getMetadata(target: object): JobMetadata {
  let metadata = Reflect.getMetadata(JOB_KEY, target) as JobMetadata;
  if (!metadata) {
    metadata = [];
    Reflect.defineMetadata(JOB_KEY, metadata, target);
  }
  return metadata;
}