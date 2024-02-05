//

import {AxiosResponseSpec} from "/client-new/util/request";
import {ErrorResponseData, ProcessName, SuccessResponseData} from "/server/controller/internal/type";


export function switchResponse<N extends ProcessName, R>(response: AxiosResponseSpec<N>, whenSuccess: (body: SuccessResponseData<N>) => R, whenError?: (body: ErrorResponseData<N>) => R): R {
  if (!("error" in response.data)) {
    const body = response.data;
    return whenSuccess(body);
  } else {
    if (whenError !== undefined) {
      const body = response.data;
      return whenError(body);
    } else {
      throw response.data;
    }
  }
}