//

import {SocketController} from "/server/controller/socket/controller";
import {controller, handler} from "/server/controller/socket/decorator";
import {SOCKET_NAMESPACE, SocketSpecsFromClient} from "/server/type/socket/internal";


@controller(SOCKET_NAMESPACE)
export class DebugSocketController extends SocketController {

  @handler("greet")
  public async [Symbol()](...[request, callback]: SocketSpecsFromClient["greet"]): Promise<void> {
    const {name} = request;
    callback(`Hello, ${name}!`);
  }

}