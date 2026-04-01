//

import {CommonResponse} from "/client/util/request";
import type {ProcessName, RequestData, ResponseData} from "/server/internal/type/rest";


export class ResponseError<N extends ProcessName> extends Error {

  public queryName: string;
  public status: number;
  public type: string;
  public requestData: RequestData<N>;
  public responseData: ResponseData<N>;

  public constructor(name: N, requestData: RequestData<N>, response: CommonResponse<N>) {
    super(`${response.status} ${response.data?.type} <- ${name} ${JSON.stringify(requestData)}`);
    this.name = "ResponseError";
    this.queryName = name;
    this.status = response.status;
    this.type = response.data?.type ?? "unexpected";
    this.requestData = requestData;
    this.responseData = response.data;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ResponseError);
    }
  }

  public static isResponseError(error: unknown): error is ResponseError<ProcessName> {
    return error instanceof Error && error.name === "ResponseError";
  }

}