//

import {SocketController} from "/server/internal/controller/socket/controller-base";
import {handler, socketController} from "/server/internal/controller/socket/decorator";
import {SOCKET_PATH_PREFIX, SocketRequestData, SocketResponseDataCallback} from "/server/internal/type/socket";


@socketController(SOCKET_PATH_PREFIX)
export class DictionarySocketController extends SocketController {

  @handler("listenUploadDictionary")
  public async [Symbol()](query: SocketRequestData<"listenUploadDictionary">, callback: SocketResponseDataCallback<"listenUploadDictionary">): Promise<void> {
    const {number} = query;
    this.socket.join(`uploadDictionary.${number}`);
    callback({});
  }

  @handler("listenDownloadDictionary")
  public async [Symbol()](query: SocketRequestData<"listenDownloadDictionary">, callback: SocketResponseDataCallback<"listenDownloadDictionary">): Promise<void> {
    const {number} = query;
    this.socket.join(`downloadDictionary.${number}`);
    callback({});
  }

}