//

import {
  useCallback
} from "react";
import {
  UseQueryOptions,
  UseQueryResult,
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


export function useQuery<N extends ProcessName>(name: N, data: RequestData<N>, config: QueryConfig<N> = {}): [ResponseData<N> | null, unknown, UseQueryRestResult<N>] {
  const [, {addErrorPopup}] = usePopup();
  const result = useRawQuery<ResponseData<N>>([name, data], async () => {
    const response = await rawRequest(name, data, config);
    if ((config.ignoreError === undefined || !config.ignoreError) && response.status >= 400) {
      const type = determineErrorPopupType(response);
      addErrorPopup(type);
    }
    return response.data;
  });
  const {data: resultData, error: resultError, ...resultRest} = result;
  return [resultData ?? null, result.error, resultRest];
}

export function useSuspenseQuery<N extends ProcessName>(name: N, data: RequestData<N>, config: QueryConfig<N> = {}): [SuccessResponseData<N>, unknown, UseQueryRestResult<N>] {
  const [, {addErrorPopup}] = usePopup();
  const result = useRawQuery<SuccessResponseData<N>>([name, data], async () => {
    const response = await rawRequest(name, data, config);
    if ((config.ignoreError === undefined || !config.ignoreError) && response.status >= 400) {
      const type = determineErrorPopupType(response);
      addErrorPopup(type);
    }
    if (response.status === 200 && !("error" in (response.data as any))) {
      return response.data;
    } else {
      console.error(response);
      throw new Error("todo: please replace with a more specific error");
    }
  }, {suspense: true, ...config});
  const {data: resultData, error: resultError, ...resultRest} = result;
  return [resultData!, resultError, resultRest];
}

export function useRequest(): RequestCallbacks {
  const [, {addErrorPopup}] = usePopup();
  const [, setUser] = useRawUser();
  const request = useCallback(async function <N extends ProcessName>(name: N, data: RequestData<N>, config: RequestConfig = {}): Promise<AxiosResponseSpec<N>> {
    const response = await rawRequest(name, data, config);
    if ((config.ignoreError === undefined || !config.ignoreError) && response.status >= 400) {
      const type = determineErrorPopupType(response);
      addErrorPopup(type);
      if (type === "unauthenticated") {
        setUser(null);
      }
    }
    return response;
  }, [setUser, addErrorPopup]);
  const requestFile = useCallback(async function <N extends ProcessName>(name: N, data: WithFile<RequestData<N>>, config: RequestConfig = {}): Promise<AxiosResponseSpec<N>> {
    const response = await rawRequestFile(name, data, config);
    if ((config.ignoreError === undefined || !config.ignoreError) && response.status >= 400) {
      const type = determineErrorPopupType(response);
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
  const {request} = useRequest();
  const [, setUser] = useRawUser();
  const login = useCallback(async function (data: RequestData<"login">, config?: RequestConfig): Promise<AxiosResponseSpec<"login">> {
    const response = await request("login", data, config);
    if (response.status === 200) {
      const body = response.data;
      setUser(body.user);
    }
    return response;
  }, [request, setUser]);
  return login;
}

export function useLogout(): (config?: RequestConfig) => Promise<AxiosResponseSpec<"logout">> {
  const {request} = useRequest();
  const [, setUser] = useRawUser();
  const logout = useCallback(async function (config?: RequestConfig): Promise<AxiosResponseSpec<"logout">> {
    const response = await request("logout", {}, config);
    if (response.status === 200) {
      setUser(null);
    }
    return response;
  }, [request, setUser]);
  return logout;
}

type QueryConfig<N extends ProcessName> = RequestConfig & UseQueryOptions<ResponseData<N>>;
type UseQueryRestResult<N extends ProcessName> = Omit<UseQueryResult<ResponseData<N>>, "data" | "error">;
type RequestCallbacks = {
  request: typeof rawRequest,
  requestFile: typeof rawRequestFile
};
