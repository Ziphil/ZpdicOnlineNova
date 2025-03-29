//

import "reflect-metadata";
import {JobController} from "/server/internal/controller/job/controller-base";


const JOB_METADATA_KEY = Symbol("worker");

type JobMetadata = Array<JobHandlerSpec>;
type JobHandlerSpec = {
  key: string | symbol,
  name: string,
  interval?: string
};

export function jobController(): ClassDecorator {
  const decorator = function (clazz: typeof JobController): void {
    const metadata = (Reflect.getMetadata(JOB_METADATA_KEY, clazz.prototype) ?? []) as JobMetadata;
    const originalPrepare = clazz.prepare;
    const originalSetup = clazz.prototype.setup;
    const originalSetupAfter = clazz.prototype.setupAfter;
    clazz.prototype.setup = function (this: JobController): void {
      originalSetup.call(this);
      const constructor = this.constructor as typeof JobController;
      for (const spec of metadata) {
        constructor.agenda.define(spec.name, (this as any)[spec.key]);
      }
    };
    clazz.prototype.setupAfter = function (this: JobController): void {
      originalSetupAfter.call(this);
      const constructor = this.constructor as typeof JobController;
      for (const spec of metadata) {
        if (spec.interval !== undefined) {
          constructor.agenda.every(spec.interval, spec.name, {}, {timezone: "Asia/Tokyo"});
        }
      }
    };
  };
  return decorator as any;
}

export function job(name: string): MethodDecorator {
  const decorator = function (target: object, key: string | symbol, descriptor: PropertyDescriptor): void {
    const spec = findJobSpec(target, key);
    spec.name = name;
  };
  return decorator;
}

export function schedule(interval: string): MethodDecorator {
  const decorator = function (target: object, key: string | symbol, descriptor: PropertyDescriptor): void {
    const spec = findJobSpec(target, key);
    spec.interval = interval;
  };
  return decorator;
}

function findJobSpec(target: object, key: string | symbol): JobHandlerSpec {
  let metadata = Reflect.getMetadata(JOB_METADATA_KEY, target) as JobMetadata;
  if (!metadata) {
    metadata = [];
    Reflect.defineMetadata(JOB_METADATA_KEY, metadata, target);
  }
  let spec = metadata.find((spec) => spec.key === key);
  if (spec === undefined) {
    spec = {key, name: key.toString()};
    metadata.push(spec);
  }
  return spec;
}
