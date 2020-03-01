//

import {
  Component
} from "react";
import {
  RouteComponentProps
} from "react-router-dom";


export class ComponentBase<P = {}, S = {}, Q = {}, N = any> extends Component<RouteComponentProps<Q> & P, S, N> {

  // 与えられた処理を実行し、例外が発生した場合は undefined を返してログインページに遷移します。
  // 引数の jump に false が渡された場合は、ページ遷移を行いません。
  // ログインしている場合のみ可能な処理を実行するのに利用できます。
  protected async inPrivate<T>(action: () => Promise<T>, jump: boolean = true): Promise<T | undefined> {
    let result;
    try {
      result = await action();
    } catch (error) {
      if (jump) {
        this.jumpLogin();
      }
    }
    return result;
  }

  protected jumpLogin(): void {
    this.props.history.push("/login");
  }

}