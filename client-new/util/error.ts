//

import {AxiosResponseSpec} from "/client-new/util/request";
import {ProcessName, RequestData, ResponseData} from "/server/controller/internal/type";


export class QueryError<N extends ProcessName> extends Error {

  public queryName: string;
  public status: number;
  public type: string;
  public requestData: RequestData<N>;
  public responseData: ResponseData<N>;

  public constructor(name: N, data: RequestData<N>, response: AxiosResponseSpec<N>) {
    super(`${response.status} ${response.data?.type} <- ${name} ${JSON.stringify(data)}`);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, QueryError);
    }
    this.name = "QueryError";
    this.queryName = name;
    this.status = response.status;
    this.type = response.data?.type ?? "unexpected";
    this.requestData = data;
    this.responseData = response.data;
  }

  public static isQueryError(error: unknown): error is QueryError<ProcessName> {
    return error instanceof Error && error.name === "QueryError";
  }

}