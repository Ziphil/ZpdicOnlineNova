//

import {SocketController} from "/server/controller/socket/controller";
import {handler, socketController} from "/server/controller/socket/decorator";
import {SOCKET_PATH_PREFIX, SocketRequestData, SocketResponseDataCallback} from "/server/type/socket/internal";


@socketController(SOCKET_PATH_PREFIX)
export class DictionarySocketController extends SocketController {

  @handler("listenUploadDictionary")
  public async [Symbol()](query: SocketRequestData<"listenUploadDictionary">, callback: SocketResponseDataCallback<"listenUploadDictionary">): Promise<void> {
    const {number} = query;
    this.socket.join(`uploadDictionary.${number}`);
    callback({});
  }

}