//

import "reflect-metadata";
import {Socket} from "socket.io";
import {SocketReservedEventsMap} from "socket.io/dist/socket";
import {ReservedOrUserEventNames, ReservedOrUserListener} from "socket.io/dist/typed-events";
import {Controller} from "/server/controller/controller";
import {SocketEventsFromClient} from "/server/type/socket/internal";


const SOCKET_METADATA_KEY = Symbol("socket");

type SocketMetadata = Array<SocketHandlerSpec>;
type SocketHandlerSpec = {
  key: string | symbol,
  name: SocketEventName
};

type SocketEventName = ReservedOrUserEventNames<SocketReservedEventsMap, SocketEventsFromClient>;
type SocketEventListener<N extends SocketEventName> = ReservedOrUserListener<SocketReservedEventsMap, SocketEventsFromClient, N>;
type SocketHandlerDecorator<N extends SocketEventName> = (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<SocketEventListener<N>>) => void;

export function socketController(path: string): ClassDecorator {
  const decorator = function (clazz: Function): void {
    const metadata = Reflect.getMetadata(SOCKET_METADATA_KEY, clazz.prototype) as SocketMetadata;
    const originalSetup = clazz.prototype.setup;
    const originalSetupConnection = clazz.prototype.setupConnection;
    clazz.prototype.setup = function (this: Controller): void {
      const namespace = this.server.of(path);
      this.socketConfig = {path};
      this.namespace = namespace;
      originalSetup.call(this);
    };
    clazz.prototype.setupConnection = function (this: Controller, socket: Socket): void {
      for (const spec of metadata) {
        socket.on(spec.name, (this as any)[spec.key].bind(this));
      }
      this.socket = socket;
      originalSetupConnection.call(this);
    };
  };
  return decorator;
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