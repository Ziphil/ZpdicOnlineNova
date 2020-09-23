//

import axios from "axios";
import {
  AxiosInstance,
  AxiosRequestConfig
} from "axios";
import {
  AxiosResponse
} from "axios";
import {
  Component,
  ReactNode
} from "react";
import {
  IntlShape
} from "react-intl";
import {
  RouteComponentProps
} from "react-router-dom";
import {
  Primitive
} from "ts-essentials";
import {
  GlobalStore
} from "/client/component/store";
import {
  DateUtil
} from "/client/util/date";
import {
  MethodType,
  ProcessName,
  RequestType,
  ResponseType,
  SERVER_PATH
} from "/server/controller/type";


export default class StoreComponent<P = {}, S = {}, Q = {}, H = any> extends Component<Partial<RouteComponentProps<Q, any, any> & AdditionalProps> & P, S, H> {

  private static client: AxiosInstance = StoreComponent.createClient();

  public constructor(props?: any) {
    super(props);
    this.initialize();
  }

  protected initialize(): void {
  }

  protected trans(id: string | number, values?: Record<string, Primitive | FormatFunction<string, string>>): string;
  protected trans(id: string | number, values?: Record<string, Primitive | ReactNode | FormatFunction<ReactNode, ReactNode>>): ReactNode;
  protected trans(id: string | number, values?: Record<string, any>): ReactNode {
    let defaultMessage = "[" + id + "?]";
    return this.props.intl!.formatMessage({id, defaultMessage}, values);
  }

  protected transDate(date: Date | number | string | null | undefined): string {
    if (date !== null && date !== undefined) {
      let format =  this.props.intl!.formatMessage({id: "common.dateFormat"});
      let locale = this.props.intl!.locale;
      return DateUtil.format(date, format, locale);
    } else {
      return this.props.intl!.formatMessage({id: "common.dateUndefined"});
    }
  }

  protected transNumber(number: number | null | undefined, digit?: number): string {
    let options = {minimumFractionDigits: digit, maximumFractionDigits: digit};
    if (number !== null && number !== undefined) {
      return this.props.intl!.formatNumber(number, options);
    } else {
      return this.props.intl!.formatMessage({id: "common.numberUndefined"});
    }
  }

  // グローバルストアのポップアップデータを削除しつつ、引数に指定されたパスに移動します。
  // ページの遷移をしてもポップアップが表示され続けるのを防ぐため、ページを遷移するときは必ずこのメソッドを使ってください。
  protected pushPath(path: string, state?: object, preservesPopup?: boolean): void {
    if (!preservesPopup) {
      this.props.store!.clearAllPopups();
    }
    this.props.history!.push(path, state);
  }

  protected replacePath(path: string, state?: object, preservesPopup?: boolean): void {
    if (!preservesPopup) {
      this.props.store!.clearAllPopups();
    }
    this.props.history!.replace(path, state);
  }

  private async request<N extends ProcessName, M extends MethodType>(name: N, method: M, config: AxiosRequestConfig & {ignoresError?: boolean}): Promise<AxiosResponse<ResponseType<N, M>>> {
    let url = SERVER_PATH[name];
    let response;
    try {
      response = await StoreComponent.client.request<ResponseType<N, M>>({url, method, ...config});
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        let data = undefined as any;
        let headers = config.headers;
        response = {status: 408, statusText: "Request Timeout", data, headers, config};
      } else {
        throw error;
      }
    }
    if (!config.ignoresError && response.status >= 400) {
      this.catchError(response);
    }
    return response;
  }

  // サーバーに GET リクエストを送り、そのリスポンスを返します。
  // HTTP ステータスコードが 400 番台もしくは 500 番台の場合は、例外は投げられませんが、代わりにグローバルストアにエラータイプを送信します。
  // これにより、ページ上部にエラーを示すポップアップが表示されます。
  // ignroesError に true を渡すことで、このエラータイプの送信を抑制できます。
  protected async requestGet<N extends ProcessName>(name: N, params: RequestType<N, "get">, ignoresError?: boolean): Promise<AxiosResponse<ResponseType<N, "get">>> {
    let config = {params, ignoresError};
    let response = await this.request(name, "get", config);
    return response;
  }

  protected async requestPost<N extends ProcessName>(name: N, data: RequestType<N, "post">, ignoresError?: boolean): Promise<AxiosResponse<ResponseType<N, "post">>> {
    let config = {data, ignoresError};
    let response = await this.request(name, "post", config);
    return response;
  }

  protected async requestPostFile<N extends ProcessName>(name: N, data: RequestType<N, "post"> & {file: Blob}, ignoresError?: boolean): Promise<AxiosResponse<ResponseType<N, "post">>> {
    let formData = new FormData();
    for (let [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }
    let config = {data: formData, timeout: 0, ignoresError};
    let response = await this.request(name, "post", config);
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
      if (typeof body === "object" && "error" in body && "type" in body && typeof body.type === "string") {
        this.props.store!.addErrorPopup(body.type);
      } else {
        this.props.store!.addErrorPopup("messageNotFound");
      }
    } else if (status === 401) {
      this.props.store!.addErrorPopup("unauthenticated");
      this.props.store!.user = null;
    } else if (status === 403) {
      if (typeof body === "object" && "error" in body && "type" in body && typeof body.type === "string") {
        this.props.store!.addErrorPopup(body.type);
      } else {
        this.props.store!.addErrorPopup("forbidden");
      }
    } else if (status === 404) {
      this.props.store!.addErrorPopup("serverNotFound");
    } else if (status === 408) {
      this.props.store!.addErrorPopup("requestTimeout");
    } else if (status === 500 || status === 503) {
      this.props.store!.addErrorPopup("serverError");
    } else if (status === 504) {
      this.props.store!.addErrorPopup("serverTimeout");
    } else {
      this.props.store!.addErrorPopup("unexpected");
    }
    return response;
  }

  private static createClient(): AxiosInstance {
    let client = axios.create({timeout: 10000, validateStatus: () => true});
    return client;
  }

}


type AdditionalProps = {
  styles: StylesType,
  intl: IntlShape,
  store: GlobalStore
};

type StylesType = {[key: string]: string | undefined};
type FormatFunction<T, R> = (parts: Array<string | T>) => R;