//

import {useCallback} from "react";
import {QueryClient, UseQueryOptions, UseQueryResult, useQuery as useRawQuery} from "react-query";
import {QueryError} from "/client-new/util/error";
import {
  AxiosResponseSpec,
  RequestConfig,
  WithFile,
  determineErrorToastType,
  request as rawRequest,
  requestFile as rawRequestFile
} from "/client-new/util/request";
import {ProcessName, RequestData, ResponseData, SuccessResponseData} from "/server/controller/internal/type";


export const queryClient = new QueryClient();

export function useQuery<N extends ProcessName>(name: N, data: RequestData<N>, config: QueryConfig<N> = {}): [SuccessResponseData<N> | undefined, unknown, UseQueryRestResult<N>] {
  const {data: queryData, error: queryError, ...rest} = useRawQuery<ResponseData<N>>([name, data], async () => {
    const response = await rawRequest(name, data, config);
    if (response.status !== 200) {
      console.error(response);
      throw new QueryError(name, data, response);
    } else {
      return response.data;
    }
  }, config);
  return [queryData, queryError, rest];
}

export function useSuspenseQuery<N extends ProcessName>(name: N, data: RequestData<N>, config: QueryConfig<N> = {}): [SuccessResponseData<N>, UseQueryRestResult<N>] {
  const {data: queryData, ...rest} = useRawQuery<SuccessResponseData<N>>([name, data], async () => {
    const response = await rawRequest(name, data, config);
    if (response.status !== 200) {
      console.error(response);
      throw new QueryError(name, data, response);
    } else {
      return response.data;
    }
  }, {suspense: true, ...config});
  if (queryData !== undefined) {
    return [queryData, rest];
  } else {
    throw new Error("[BUG] suspensed query returns undefined");
  }
}

export function useRequest(): typeof rawRequest {
  const request = useCallback(async function <N extends ProcessName>(name: N, data: RequestData<N>, config: RequestConfig = {}): Promise<AxiosResponseSpec<N>> {
    const response = await rawRequest(name, data, config);
    if ((config.ignoreError === undefined || !config.ignoreError) && response.status >= 400) {
      const type = determineErrorToastType(response);
    }
    return response;
  }, []);
  return request;
}

export function useRequestFile(): typeof rawRequestFile {
  const requestFile = useCallback(async function <N extends ProcessName>(name: N, data: WithFile<RequestData<N>>, config: RequestConfig = {}): Promise<AxiosResponseSpec<N>> {
    const response = await rawRequestFile(name, data, config);
    if ((config.ignoreError === undefined || !config.ignoreError) && response.status >= 400) {
      const type = determineErrorToastType(response);
    }
    return response;
  }, []);
  return requestFile;
}

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

type QueryConfig<N extends ProcessName> = RequestConfig & UseQueryOptions<ResponseData<N>>;
type UseQueryRestResult<N extends ProcessName> = Omit<UseQueryResult<ResponseData<N>>, "data" | "error">;