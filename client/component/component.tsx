//

import {
  Component
} from "react";
import {
  RouteComponentProps
} from "react-router-dom";


export class ComponentBase<P = {}, S = {}, Q = {}, N = any> extends Component<RouteComponentProps<Q> & P, S, N> {

  // 与えられた処理を実行し、例外が発生した場合は undefined を返してログインページにジャンプします。
  // ログインしている場合のみ可能な処理を実行するのに利用できます。
  protected inPrivate<T>(action: () => T): T | undefined {
    let result;
    try {
      result = action();
    } catch (error) {
      this.props.history.push("/login");
    }
    return result;
  }

}