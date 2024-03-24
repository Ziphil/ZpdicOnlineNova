//

import "reflect-metadata";
import {JobController} from "/server/controller/job/controller";


const JOB_METADATA_KEY = Symbol("worker");

type JobMetadata = Array<JobHandlerSpec>;
type JobHandlerSpec = {
  key: string | symbol,
  name: string
};

export function jobController(): ClassDecorator {
  const decorator = function (clazz: typeof JobController): void {
    const metadata = (Reflect.getMetadata(JOB_METADATA_KEY, clazz.prototype) ?? []) as JobMetadata;
    const originalPrepare = clazz.prepare;
    const originalSetup = clazz.prototype.setup;
    clazz.prototype.setup = function (this: JobController): void {
      originalSetup.call(this);
      const constructor = this.constructor as typeof JobController;
      for (const spec of metadata) {
        constructor.agenda.define(spec.name, (job, done) => (this as any)[spec.key](job).then(done));
      }
    };
  };
  return decorator as any;
}

export function job(name: string): MethodDecorator {
  const decorator = function (target: object, key: string | symbol, descriptor: PropertyDescriptor): void {
    const metadata = getMetadata(target);
    metadata.push({key, name});
  };
  return decorator;
}

function getMetadata(target: object): JobMetadata {
  let metadata = Reflect.getMetadata(JOB_METADATA_KEY, target) as JobMetadata;
  if (!metadata) {
    metadata = [];
    Reflect.defineMetadata(JOB_METADATA_KEY, metadata, target);
  }
  return metadata;
}