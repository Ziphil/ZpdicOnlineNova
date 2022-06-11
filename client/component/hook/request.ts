//

import {
  useCallback
} from "react";
import {
  QueryStatus,
  UseQueryOptions,
  useQuery as useRawQuery
} from "react-query";
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
  RequestData,
  ResponseData,
  SuccessResponseData
} from "/server/controller/internal/type";


export function useQuery<N extends ProcessName>(name: N, data: RequestData<N>, config: QueryConfig<N> = {}): [ResponseData<N> | null, unknown, QueryStatus] {
  let [, {addErrorPopup}] = usePopup();
  let result = useRawQuery<ResponseData<N>>([name, data], async () => {
    let response = await rawRequest(name, data, config);
    if ((config.ignoreError === undefined || !config.ignoreError) && response.status >= 400) {
      let type = determineErrorPopupType(response);
      addErrorPopup(type);
    }
    return response.data;
  });
  return [result.data ?? null, result.error, result.status];
}

export function useSuspenseQuery<N extends ProcessName>(name: N, data: RequestData<N>, config: QueryConfig<N> = {}): [SuccessResponseData<N>, unknown, QueryStatus] {
  let [, {addErrorPopup}] = usePopup();
  let result = useRawQuery<SuccessResponseData<N>>([name, data], async () => {
    let response = await rawRequest(name, data, config);
    if ((config.ignoreError === undefined || !config.ignoreError) && response.status >= 400) {
      let type = determineErrorPopupType(response);
      addErrorPopup(type);
    }
    if (response.status === 200 && !("error" in (response.data as any))) {
      return response.data;
    } else {
      console.error(response);
      throw new Error("todo: please replace with a more specific error");
    }
  }, {suspense: true, ...config});
  return [result.data!, result.error, result.status];
}

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

type QueryConfig<N extends ProcessName> = RequestConfig & UseQueryOptions<ResponseData<N>>;
type RequestCallbacks = {
  request: typeof rawRequest,
  requestFile: typeof rawRequestFile
};
