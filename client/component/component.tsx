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
  Main
} from "/client/index";
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


export default class BaseComponent<P = {}, S = {}, Q = {}, H = any> extends Component<Props<P, Q>, S, H> {

  private static client: AxiosInstance = BaseComponent.createClient();

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

  private async request<N extends ProcessName, M extends MethodType>(name: N, method: M, config: RequestConfig = {}): Promise<AxiosResponseType<N, M>> {
    let url = SERVER_PATH[name];
    if (config.useRecaptcha) {
      let action = (typeof config.useRecaptcha === "string") ? config.useRecaptcha : "action";
      let recaptchaToken = await grecaptcha.execute(Main.getRecaptchaSite(), {action});
      if (config.params !== undefined) {
        config.params.recaptchaToken = recaptchaToken;
      }
      if (config.data !== undefined) {
        if (config.data instanceof FormData) {
          config.data.append("recaptchaToken", recaptchaToken);
        } else {
          config.data.recaptchaToken = recaptchaToken;
        }
      }
    }
    let response = await (() => {
      try {
        return BaseComponent.client.request<ResponseType<N, M>>({url, method, ...config});
      } catch (error) {
        if (error.code === "ECONNABORTED") {
          let data = undefined as any;
          let headers = config.headers;
          return {status: 408, statusText: "Request Timeout", data, headers, config};
        } else {
          throw error;
        }
      }
    })();
    if ((config.ignoreError === undefined || !config.ignoreError) && response.status >= 400) {
      this.catchError(response);
    }
    return response;
  }

  // サーバーに GET リクエストを送り、そのリスポンスを返します。
  // HTTP ステータスコードが 400 番台もしくは 500 番台の場合は、例外は投げられませんが、代わりにグローバルストアにエラータイプを送信します。
  // これにより、ページ上部にエラーを示すポップアップが表示されます。
  // ignroesError に true を渡すことで、このエラータイプの送信を抑制できます。
  protected async requestGet<N extends ProcessName>(name: N, params: Omit<RequestType<N, "get">, "recaptchaToken">, config: RequestConfig & {useRecaptcha: true}): Promise<AxiosResponseType<N, "get">>;
  protected async requestGet<N extends ProcessName>(name: N, params: RequestType<N, "get">, config?: RequestConfig): Promise<AxiosResponseType<N, "get">>;
  protected async requestGet<N extends ProcessName>(name: N, params: RequestType<N, "get">, config: RequestConfig = {}): Promise<AxiosResponseType<N, "get">> {
    let nextConfig = {...config, params};
    let response = await this.request(name, "get", nextConfig);
    return response;
  }

  protected async requestPost<N extends ProcessName>(name: N, data: Omit<RequestType<N, "post">, "recaptchaToken">, config: RequestConfig & {useRecaptcha: true}): Promise<AxiosResponseType<N, "post">>;
  protected async requestPost<N extends ProcessName>(name: N, data: RequestType<N, "post">, config?: RequestConfig): Promise<AxiosResponseType<N, "post">>;
  protected async requestPost<N extends ProcessName>(name: N, data: RequestType<N, "post">, config: RequestConfig = {}): Promise<AxiosResponseType<N, "post">> {
    let nextConfig = {...config, data};
    let response = await this.request(name, "post", nextConfig);
    return response;
  }

  protected async requestPostFile<N extends ProcessName>(name: N, data: RequestType<N, "post"> & {file: Blob}, config: RequestConfig = {}): Promise<AxiosResponseType<N, "post">> {
    let formData = new FormData();
    for (let [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }
    let nextConfig = {...config, data: formData, timeout: 0};
    let response = await this.request(name, "post", nextConfig);
    return response;
  }

  protected async login(data: RequestType<"login", "post">, config: RequestConfig = {}): Promise<AxiosResponseType<"login", "post">> {
    let response = await this.requestPost("login", data, config);
    if (response.status === 200) {
      let body = response.data;
      this.props.store!.user = body.user;
    }
    return response;
  }

  protected async logout(config: RequestConfig = {}): Promise<AxiosResponseType<"logout", "post">> {
    let response = await this.requestPost("logout", {}, config);
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
type AdditionalRequestConfig = {
  ignoreError?: boolean,
  useRecaptcha?: boolean | string
};

type Props<P, Q> = Partial<RouteComponentProps<Q, any, any> & AdditionalProps> & P;
type RequestConfig = AxiosRequestConfig & AdditionalRequestConfig;

type StylesType = {[key: string]: string | undefined};
type FormatFunction<T, R> = (parts: Array<string | T>) => R;
type AxiosResponseType<N extends ProcessName, M extends MethodType> = AxiosResponse<ResponseType<N, M>>;