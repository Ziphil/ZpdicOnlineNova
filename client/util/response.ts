//

import {AxiosResponseSpec} from "/client/util/request";
import type {ErrorResponseData, ProcessName, SuccessResponseData} from "/server/type/internal";


export function switchResponse<N extends ProcessName, R>(response: AxiosResponseSpec<N>, whenSuccess: (body: SuccessResponseData<N>) => R): R | void;
export function switchResponse<N extends ProcessName, R>(response: AxiosResponseSpec<N>, whenSuccess: (body: SuccessResponseData<N>) => R, whenError: (body: ErrorResponseData<N>) => R): R;
export function switchResponse<N extends ProcessName, R>(response: AxiosResponseSpec<N>, whenSuccess: (body: SuccessResponseData<N>) => R, whenError?: (body: ErrorResponseData<N>) => R): R | undefined {
  if (!(response.data !== null && typeof response.data === "object" && "error" in response.data)) {
    const body = response.data;
    return whenSuccess(body);
  } else {
    if (whenError !== undefined) {
      const body = response.data;
      return whenError(body);
    } else {
      return undefined;
    }
  }
}