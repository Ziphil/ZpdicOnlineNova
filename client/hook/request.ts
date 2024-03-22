//

import {useCallback} from "react";
import {QueryClient, UseQueryOptions, UseQueryResult, useQuery as useRawQuery} from "react-query";
import {useToast} from "/client/hook/toast";
import {
  AxiosResponseSpec,
  RequestConfig,
  WithFile,
  determineErrorToastType,
  request as rawRequest,
  requestFile as rawRequestFile
} from "/client/util/request";
import {switchResponse} from "/client/util/response";
import {ResponseError} from "/client/util/response-error";
import type {ProcessName, RequestData, ResponseData, SuccessResponseData} from "/server/type/internal";


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60,
      staleTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false
    }
  }
});

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
  const responseResult = useRawQuery<ResponseData<N>>([name, data], async () => {
    if (data) {
      const response = await rawRequest(name, data, config);
      return switchResponse(response, (data) => {
        return data;
      }, () => {
        throw new ResponseError(name, data, response);
      });
    } else {
      throw new Error("cannot happen");
    }
  }, {...config, enabled: !!data});
  const responseData = responseResult.data;
  const responseError = responseResult.error;
  return [responseData, responseError, responseResult];
}

export function useSuspenseResponse<N extends ProcessName>(name: N, data: RequestData<N>, config: ResponseConfig<N> = {}): [SuccessResponseData<N>, ResponseRest<N>] {
  const responseResult = useRawQuery<SuccessResponseData<N>>([name, data], async () => {
    const response = await rawRequest(name, data, config);
    return switchResponse(response, (data) => {
      return data;
    }, () => {
      throw new ResponseError(name, data, response);
    });
  }, {suspense: true, ...config});
  const responseData = responseResult.data;
  if (responseData !== undefined) {
    return [responseData, responseResult];
  } else {
    throw new Error("suspensed query returns undefined");
  }
}

export async function fetchResponse<N extends ProcessName>(name: N, data: RequestData<N>, config: RequestConfig = {}): Promise<SuccessResponseData<N>> {
  const responseResult = await queryClient.fetchQuery([name, data], async () => {
    const response = await rawRequest(name, data, config);
    return switchResponse(response, (data) => {
      return data;
    }, () => {
      throw new ResponseError(name, data, response);
    });
  });
  return responseResult;
}

export async function prefetchResponse<N extends ProcessName>(name: N, data: RequestData<N>, config: RequestConfig = {}): Promise<void> {
  await queryClient.prefetchQuery([name, data], async () => {
    const response = await rawRequest(name, data, config);
    return switchResponse(response, (data) => {
      return data;
    }, () => {
      throw new ResponseError(name, data, response);
    });
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

export async function invalidateAllResponses(): Promise<void> {
  await queryClient.invalidateQueries();
}

type ResponseConfig<N extends ProcessName> = RequestConfig & UseQueryOptions<ResponseData<N>>;
type ResponseRest<N extends ProcessName> = Omit<UseQueryResult<ResponseData<N>>, "data" | "error">;

type FalsyData = undefined | null | false;