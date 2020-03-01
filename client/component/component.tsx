//

import {
  Component
} from "react";
import {
  RouteComponentProps
} from "react-router-dom";
import * as http from "/client/util/http";


export class ComponentBase<P = {}, S = {}, Q = {}, N = any> extends Component<RouteComponentProps<Q> & P, S, N> {

  // 発生した例外が HTTP リクエストの 403 エラーであった場合に、ログインページに遷移します。
  // それ以外の例外であった場合は、単にその例外を再発生させます。
  // 引数として例外値が渡されなかった場合は、無条件でログインページに遷移します。
  protected jumpLogin(error?: any): void {
    if (error === undefined || error?.respone?.status === 403) {
      http.logout();
      this.props.history.push("/login");
    } else {
      if (error) {
        throw error;
      }
    }
  }

}