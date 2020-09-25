//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import OrderWordForm from "/client/component/compound/order-word-form";
import {
  style
} from "/client/component/decorator";
import Page from "/client/component/page/page";
import {
  Dictionary
} from "/server/skeleton/dictionary";


@style(require("./order-word-page.scss"))
export default class OrderWordPage extends Component<Props, State, Params> {

  public state: State = {
    dictionary: null
  };

  public async componentDidMount(): Promise<void> {
    let number = +this.props.match!.params.number;
    let response = await this.requestGet("fetchDictionary", {number});
    if (response.status === 200 && !("error" in response.data)) {
      let dictionary = response.data;
      this.setState({dictionary});
    } else {
      this.setState({dictionary: null});
    }
  }

  public render(): ReactNode {
    let node = (
      <Page dictionary={this.state.dictionary} showDictionary={true}>
        <div styleName="description">{this.trans("orderWordPage.description")}</div>
        <div styleName="form">
          <OrderWordForm dictionary={this.state.dictionary}/>
        </div>
      </Page>
    );
    return node;
  }

}


type Props = {
};
type State = {
  dictionary: Dictionary | null
};
type Params = {
  number: string
};