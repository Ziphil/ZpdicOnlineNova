//

import {SocketController} from "/server/controller/socket/controller";
import {handler, socketController} from "/server/controller/socket/decorator";
import {SOCKET_PATH_PREFIX, SocketRequestData, SocketResponseDataCallback} from "/server/type/socket/internal";


@socketController(SOCKET_PATH_PREFIX)
export class DebugSocketController extends SocketController {

  @handler("greet")
  public async [Symbol()](query: SocketRequestData<"greet">, callback: SocketResponseDataCallback<"greet">): Promise<void> {
    const {name} = query;
    callback({message: `Hello, ${name}!`});
    this.namespace.emit("greet", {message: `Hello again, ${name}!`});
  }

}