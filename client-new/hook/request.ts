//

import {useCallback} from "react";
import {QueryClient, UseQueryOptions, UseQueryResult, useQuery as useRawQuery} from "react-query";
import {useToast} from "/client-new/hook/toast";
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

export function useRequest(): typeof rawRequest {
  const {dispatchErrorToast} = useToast();
  const request = useCallback(async function <N extends ProcessName>(name: N, data: RequestData<N>, config: RequestConfig = {}): Promise<AxiosResponseSpec<N>> {
    const response = await rawRequest(name, data, config);
    if ((config.ignoreError === undefined || !config.ignoreError) && response.status >= 400) {
      const type = determineErrorToastType(response);
      dispatchErrorToast(type);
    }
    return response;
  }, [dispatchErrorToast]);
  return request;
}

export function useRequestFile(): typeof rawRequestFile {
  const {dispatchErrorToast} = useToast();
  const requestFile = useCallback(async function <N extends ProcessName>(name: N, data: WithFile<RequestData<N>>, config: RequestConfig = {}): Promise<AxiosResponseSpec<N>> {
    const response = await rawRequestFile(name, data, config);
    if ((config.ignoreError === undefined || !config.ignoreError) && response.status >= 400) {
      const type = determineErrorToastType(response);
      dispatchErrorToast(type);
    }
    return response;
  }, [dispatchErrorToast]);
  return requestFile;
}

export function useResponse<N extends ProcessName>(name: N, data: RequestData<N> | FalsyData, config: ResponseConfig<N> = {}): [SuccessResponseData<N> | undefined, unknown, ResponseRest<N>] {
  const {data: responseData, error: responseError, ...rest} = useRawQuery<ResponseData<N>>([name, data], async () => {
    if (data) {
      const response = await rawRequest(name, data, config);
      if (response.status !== 200) {
        console.error(response);
        throw new QueryError(name, data, response);
      } else {
        return response.data;
      }
    } else {
      throw new Error("[BUG] cannot happen");
    }
  }, {...config, enabled: !!data});
  return [responseData, responseError, rest];
}

export function useSuspenseResponse<N extends ProcessName>(name: N, data: RequestData<N>, config: ResponseConfig<N> = {}): [SuccessResponseData<N>, ResponseRest<N>] {
  const {data: responseData, ...rest} = useRawQuery<SuccessResponseData<N>>([name, data], async () => {
    const response = await rawRequest(name, data, config);
    if (response.status !== 200) {
      console.error(response);
      throw new QueryError(name, data, response);
    } else {
      return response.data;
    }
  }, {suspense: true, ...config});
  if (responseData !== undefined) {
    return [responseData, rest];
  } else {
    throw new Error("[BUG] suspensed query returns undefined");
  }
}

export async function prefetchResponse<N extends ProcessName>(name: N, data: RequestData<N>, config: RequestConfig = {}): Promise<void> {
  await queryClient.prefetchQuery([name, data], async () => {
    const response = await rawRequest(name, data, config);
    if (response.status !== 200) {
      throw new QueryError(name, data, response);
    } else {
      return response.data;
    }
  });
}

export async function invalidateResponses<N extends ProcessName>(name: N, predicate?: (data: RequestData<N>) => boolean): Promise<void> {
  await queryClient.invalidateQueries({predicate: (query) => {
    if (predicate !== undefined) {
      return query.queryKey[0] === name && predicate(query.queryKey[1] as any);
    } else {
      return query.queryKey[0] === name;
    }
  }});
}

type ResponseConfig<N extends ProcessName> = RequestConfig & UseQueryOptions<ResponseData<N>>;
type ResponseRest<N extends ProcessName> = Omit<UseQueryResult<ResponseData<N>>, "data" | "error">;

type FalsyData = undefined | null | false;