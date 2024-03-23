//

import {SocketController} from "/server/controller/socket/controller";
import {controller, handler} from "/server/controller/socket/decorator";
import {RequestData, ResponseDataCallback, SOCKET_NAMESPACE} from "/server/type/socket/internal";


@controller(SOCKET_NAMESPACE)
export class DebugSocketController extends SocketController {

  @handler("greet")
  public async [Symbol()](query: RequestData<"greet">, callback: ResponseDataCallback<"greet">): Promise<void> {
    const {name} = query;
    callback({message: `Hello, ${name}!`});
    this.namespace.emit("greet", {message: `Hello again, ${name}!`});
  }

}