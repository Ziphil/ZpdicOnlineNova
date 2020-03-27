//

import axios from "axios";
import {
  AxiosResponse
} from "axios";
import {
  Component as ReactComponent
} from "react";
import {
  RouteComponentProps
} from "react-router-dom";
import {
  GlobalStore
} from "/client/component/store";
import {
  ProcessName,
  RequestType,
  ResponseType,
  SERVER_PATH
} from "/server/controller/type";


export class Component<P, S, H = any> extends ReactComponent<P, S, H> {

  public state!: S;

  public constructor(props: Readonly<P>) {
    super(props);
    this.initialize();
  }

  protected initialize(): void {
  }

}


export class RouteComponent<P = {}, S = {}, Q = {}, H = any> extends Component<Partial<RouteComponentProps<Q>> & P, S, H> {

}


export class StoreComponent<P = {}, S = {}, Q = {}, H = any> extends RouteComponent<{store?: GlobalStore} & P, S, Q, H> {

  // グローバルストアのポップアップデータを削除しつつ、引数に指定されたパスに移動します。
  // ページの遷移をしてもポップアップが表示され続けるのを防ぐため、ページを遷移するときは必ずこのメソッドを使ってください。
  protected pushPath(path: string, preservesPopup?: boolean): void {
    if (!preservesPopup) {
      this.props.store!.clearPopup();
    }
    this.props.history!.push(path);
  }

  protected replacePath(path: string, preservesPopup?: boolean): void {
    if (!preservesPopup) {
      this.props.store!.clearPopup();
    }
    this.props.history!.replace(path);
  }

  // サーバーに GET リクエストを送り、そのリスポンスを返します。
  // HTTP ステータスコードが 400 番台もしくは 500 番台の場合は、例外は投げられませんが、代わりにグローバルストアにエラータイプを送信します。
  // これにより、ページ上部にエラーを示すポップアップが表示されます。
  // ignroesError に true を渡すことで、このエラータイプの送信を抑制できます。
  protected async requestGet<N extends ProcessName>(name: N, params: RequestType<N, "get">, ignoresError?: boolean): Promise<AxiosResponse<ResponseType<N, "get">>> {
    let url = SERVER_PATH[name];
    let response = await axios.get<ResponseType<N, "get">>(url, {params, validateStatus: () => true});
    if (!ignoresError && response.status >= 400) {
      this.catchError(response);
    }
    return response;
  }

  protected async requestPost<N extends ProcessName>(name: N, data: RequestType<N, "post">, ignoresError?: boolean): Promise<AxiosResponse<ResponseType<N, "post">>> {
    let url = SERVER_PATH[name];
    let response = await axios.post<ResponseType<N, "post">>(url, data, {validateStatus: () => true});
    if (!ignoresError && response.status >= 400) {
      this.catchError(response);
    }
    return response;
  }

  protected async requestPostFile<N extends ProcessName>(name: N, data: RequestType<N, "post"> & {file: Blob}, ignoresError?: boolean): Promise<AxiosResponse<ResponseType<N, "post">>> {
    let url = SERVER_PATH[name];
    let headers = {} as any;
    let anyData = data as any;
    let nextData = new FormData();
    for (let key of Object.keys(data)) {
      nextData.append(key, anyData[key]);
    }
    headers["content-type"] = "multipart/form-data";
    let response = await axios.post<ResponseType<N, "post">>(url, nextData, {headers, validateStatus: () => true});
    if (!ignoresError && response.status >= 400) {
      this.catchError(response);
    }
    return response;
  }

  protected async login(data: RequestType<"login", "post">, ignoresError?: boolean): Promise<AxiosResponse<ResponseType<"login", "post">>> {
    let response = await this.requestPost("login", data, ignoresError);
    if (response.status === 200) {
      let body = response.data;
      this.props.store!.user = body.user;
    }
    return response;
  }

  protected async logout(ignoresError?: boolean): Promise<AxiosResponse<ResponseType<"logout", "post">>> {
    let response = await this.requestPost("logout", {}, ignoresError);
    if (response.status === 200) {
      this.props.store!.user = null;
    }
    return response;
  }

  private catchError<T>(response: AxiosResponse<T>): AxiosResponse<T> {
    let status = response.status;
    let body = response.data as any;
    if (status === 400) {
      if ("error" in body && "type" in body && typeof body.type === "string") {
        this.props.store!.sendError(body.type);
      } else {
        this.props.store!.sendError("messageNotFound");
      }
    } else if (status === 401) {
      this.props.store!.sendError("unauthenticated");
    } else if (status === 403) {
      this.props.store!.sendError("forbidden");
    } else if (status === 404) {
      this.props.store!.sendError("serverNotFound");
    } else if (status === 500 || status === 503) {
      this.props.store!.sendError("serverError");
    } else if (status === 504) {
      this.props.store!.sendError("serverTimeout");
    } else {
      this.props.store!.sendError("unexpected");
    }
    return response;
  }

}