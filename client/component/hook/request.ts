//

import {
  useCallback,
  useMemo
} from "react";
import {
  QueryClient,
  UseQueryOptions,
  UseQueryResult,
  useQuery as useRawQuery
} from "react-query";
import {
  usePopup
} from "/client/component/hook/popup";
import {
  useRawMe
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


export const queryClient = new QueryClient();

export async function prefetchQuery<N extends ProcessName>(name: N, data: RequestData<N>, config: RequestConfig = {}): Promise<void> {
  await queryClient.prefetchQuery([name, data], async () => {
    const response = await rawRequest(name, data, config);
    if (response.status !== 200) {
      throw new QueryError(name, data, response);
    } else {
      return response.data;
    }
  });
}

export async function invalidateQueries<N extends ProcessName>(name: N, predicate?: (data: RequestData<N>) => boolean): Promise<void> {
  await queryClient.invalidateQueries({predicate: (query) => {
    if (predicate !== undefined) {
      return query.queryKey[0] === name && predicate(query.queryKey[1] as any);
    } else {
      return query.queryKey[0] === name;
    }
  }});
}

export function useQuery<N extends ProcessName>(name: N, data: RequestData<N>, config: QueryConfig<N> = {}): [ResponseData<N> | null, unknown, UseQueryRestResult<N>] {
  const [, {addErrorPopup}] = usePopup();
  const {data: queryData, error: queryError, ...rest} = useRawQuery<ResponseData<N>>([name, data], async () => {
    const response = await rawRequest(name, data, config);
    if ((config.ignoreError === undefined || !config.ignoreError) && response.status >= 400) {
      const type = determineErrorPopupType(response);
      addErrorPopup(type);
    }
    return response.data;
  });
  return [queryData ?? null, queryError, rest];
}

export function useSuspenseQuery<N extends ProcessName, T = SuccessResponseData<N>>(name: N, data: RequestData<N>, config: QueryConfig<N> = {}, transform?: (data: SuccessResponseData<N>) => T): [T, UseQueryRestResult<N>] {
  const [, {addErrorPopup}] = usePopup();
  const {data: queryData, ...rest} = useRawQuery<SuccessResponseData<N>>([name, data], async () => {
    const response = await rawRequest(name, data, config);
    if ((config.ignoreError === undefined || !config.ignoreError) && response.status >= 400) {
      const type = determineErrorPopupType(response);
      addErrorPopup(type);
    }
    if (response.status !== 200) {
      console.error(response);
      throw new QueryError(name, data, response);
    } else {
      return response.data;
    }
  }, {suspense: true, ...config});
  if (queryData === undefined) {
    throw new Error("bug");
  }
  const transformedData = useMemo(() => {
    if (transform !== undefined) {
      return transform(queryData);
    } else {
      return queryData;
    }
  }, [queryData, transform]);
  return [transformedData, rest];
}

export function useRequest(): RequestCallbacks {
  const [, {addErrorPopup}] = usePopup();
  const [, setMe] = useRawMe();
  const request = useCallback(async function <N extends ProcessName>(name: N, data: RequestData<N>, config: RequestConfig = {}): Promise<AxiosResponseSpec<N>> {
    const response = await rawRequest(name, data, config);
    if ((config.ignoreError === undefined || !config.ignoreError) && response.status >= 400) {
      const type = determineErrorPopupType(response);
      addErrorPopup(type);
      if (type === "unauthenticated") {
        setMe(null);
      }
    }
    return response;
  }, [setMe, addErrorPopup]);
  const requestFile = useCallback(async function <N extends ProcessName>(name: N, data: WithFile<RequestData<N>>, config: RequestConfig = {}): Promise<AxiosResponseSpec<N>> {
    const response = await rawRequestFile(name, data, config);
    if ((config.ignoreError === undefined || !config.ignoreError) && response.status >= 400) {
      const type = determineErrorPopupType(response);
      addErrorPopup(type);
      if (type === "unauthenticated") {
        setMe(null);
      }
    }
    return response;
  }, [setMe, addErrorPopup]);
  return {request, requestFile};
}

export function useLogin(): (data: RequestData<"login">, config?: RequestConfig) => Promise<AxiosResponseSpec<"login">> {
  const {request} = useRequest();
  const [, setMe] = useRawMe();
  const login = useCallback(async function (data: RequestData<"login">, config?: RequestConfig): Promise<AxiosResponseSpec<"login">> {
    const response = await request("login", data, config);
    if (response.status === 200) {
      const body = response.data;
      setMe(body.user);
    }
    return response;
  }, [request, setMe]);
  return login;
}

export function useLogout(): (config?: RequestConfig) => Promise<AxiosResponseSpec<"logout">> {
  const {request} = useRequest();
  const [, setMe] = useRawMe();
  const logout = useCallback(async function (config?: RequestConfig): Promise<AxiosResponseSpec<"logout">> {
    const response = await request("logout", {}, config);
    if (response.status === 200) {
      setMe(null);
    }
    return response;
  }, [request, setMe]);
  return logout;
}

type QueryConfig<N extends ProcessName> = RequestConfig & UseQueryOptions<ResponseData<N>>;
type UseQueryRestResult<N extends ProcessName> = Omit<UseQueryResult<ResponseData<N>>, "data" | "error">;
type RequestCallbacks = {
  request: typeof rawRequest,
  requestFile: typeof rawRequestFile
};


export class QueryError<N extends ProcessName> extends Error {

  public queryName: string;
  public status: number;
  public type: string;
  public requestData: RequestData<N>;
  public responseData: ResponseData<N>;

  public constructor(name: N, data: RequestData<N>, response: AxiosResponseSpec<N>) {
    super(`${response.status} error; ${name}, data: ${JSON.stringify(data)}`);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, QueryError);
    }
    this.name = "QueryError";
    this.queryName = name;
    this.status = response.status;
    this.type = response.data?.type;
    this.requestData = data;
    this.responseData = response.data;
  }

}