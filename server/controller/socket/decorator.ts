//

import "reflect-metadata";
import {SocketReservedEventsMap} from "socket.io/dist/socket";
import {ReservedOrUserEventNames, ReservedOrUserListener} from "socket.io/dist/typed-events";
import {SocketController} from "/server/controller/socket/controller";
import {SocketEventsFromClient} from "/server/internal/type/socket";


const SOCKET_METADATA_KEY = Symbol("socket");

type SocketMetadata = Array<SocketHandlerSpec>;
type SocketHandlerSpec = {
  key: string | symbol,
  name: SocketEventName
};

type SocketEventName = ReservedOrUserEventNames<SocketReservedEventsMap, SocketEventsFromClient>;
type SocketEventListener<N extends SocketEventName> = ReservedOrUserListener<SocketReservedEventsMap, SocketEventsFromClient, N>;

type SocketHandlerDecorator<N extends SocketEventName> = (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<SocketEventListener<N>>) => void;

export function socketController(socketPath: string): ClassDecorator {
  const decorator = function (clazz: typeof SocketController): void {
    const metadata = (Reflect.getMetadata(SOCKET_METADATA_KEY, clazz.prototype) ?? []) as SocketMetadata;
    const originalPrepare = clazz.prepare;
    const originalSetup = clazz.prototype.setup;
    clazz.prepare = function (this: typeof SocketController, application, server, agenda): void {
      originalPrepare.call(this, application, server, agenda);
      this.namespace = server.of(socketPath);
    };
    clazz.prototype.setup = function (this: SocketController): void {
      originalSetup.call(this);
      for (const spec of metadata) {
        this.socket.on(spec.name, (this as any)[spec.key].bind(this));
      }
    };
  };
  return decorator as any;
}

export function handler<N extends SocketEventName>(name: N): SocketHandlerDecorator<N> {
  const decorator = function (target: object, key: string | symbol, descriptor: PropertyDescriptor): void {
    const metadata = getMetadata(target);
    metadata.push({key, name});
  };
  return decorator;
}

function getMetadata(target: object): SocketMetadata {
  let metadata = Reflect.getMetadata(SOCKET_METADATA_KEY, target) as SocketMetadata;
  if (!metadata) {
    metadata = [];
    Reflect.defineMetadata(SOCKET_METADATA_KEY, metadata, target);
  }
  return metadata;
}