//

import {
  useCallback
} from "react";
import {
  usePopup
} from "/client/component/hook/popup";
import {
  useRawUser
} from "/client/component/hook/user";
import {
  AxiosResponseSpec,
  RequestConfig,
  WithFile,
  determineErrorPopupType,
  request as rawRequest,
  requestFile as rawRequestFile
} from "/client/util/request";
import {
  ProcessName,
  RequestData
} from "/server/controller/internal/type";


export function useRequest(): RequestCallbacks {
  let [, {addErrorPopup}] = usePopup();
  let [, setUser] = useRawUser();
  let request = useCallback(async function <N extends ProcessName>(name: N, data: RequestData<N>, config: RequestConfig = {}): Promise<AxiosResponseSpec<N>> {
    let response = await rawRequest(name, data, config);
    if ((config.ignoreError === undefined || !config.ignoreError) && response.status >= 400) {
      let type = determineErrorPopupType(response);
      addErrorPopup(type);
      if (type === "unauthenticated") {
        setUser(null);
      }
    }
    return response;
  }, [setUser, addErrorPopup]);
  let requestFile = useCallback(async function <N extends ProcessName>(name: N, data: WithFile<RequestData<N>>, config: RequestConfig = {}): Promise<AxiosResponseSpec<N>> {
    let response = await rawRequestFile(name, data, config);
    if ((config.ignoreError === undefined || !config.ignoreError) && response.status >= 400) {
      let type = determineErrorPopupType(response);
      addErrorPopup(type);
      if (type === "unauthenticated") {
        setUser(null);
      }
    }
    return response;
  }, [setUser, addErrorPopup]);
  return {request, requestFile};
}

export function useLogin(): (data: RequestData<"login">, config?: RequestConfig) => Promise<AxiosResponseSpec<"login">> {
  let {request} = useRequest();
  let [, setUser] = useRawUser();
  let login = useCallback(async function (data: RequestData<"login">, config?: RequestConfig): Promise<AxiosResponseSpec<"login">> {
    let response = await request("login", data, config);
    if (response.status === 200) {
      let body = response.data;
      setUser(body.user);
    }
    return response;
  }, [request, setUser]);
  return login;
}

export function useLogout(): (config?: RequestConfig) => Promise<AxiosResponseSpec<"logout">> {
  let {request} = useRequest();
  let [, setUser] = useRawUser();
  let logout = useCallback(async function (config?: RequestConfig): Promise<AxiosResponseSpec<"logout">> {
    let response = await request("logout", {}, config);
    if (response.status === 200) {
      setUser(null);
    }
    return response;
  }, [request, setUser]);
  return logout;
}

type RequestCallbacks = {
  request: typeof rawRequest,
  requestFile: typeof rawRequestFile
};