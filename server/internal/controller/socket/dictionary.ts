//

import {SocketController} from "/server/controller/socket/controller";
import {socketController} from "/server/controller/socket/decorator";
import {SOCKET_PATH_PREFIX} from "/server/internal/type/socket";


@socketController(SOCKET_PATH_PREFIX)
export class DictionarySocketController extends SocketController {

}