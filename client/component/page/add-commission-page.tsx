//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import AddCommissionForm from "/client/component/compound/add-commission-form";
import {
  style
} from "/client/component/decorator";
import Page from "/client/component/page/page";
import {
  EnhancedDictionary
} from "/client/skeleton/dictionary";


@style(require("./add-commission-page.scss"))
export default class AddCommissionPage extends Component<Props, State, Params> {

  public state: State = {
    dictionary: null
  };

  public async componentDidMount(): Promise<void> {
    let number = +this.props.match!.params.number;
    let response = await this.request("fetchDictionary", {number});
    if (response.status === 200 && !("error" in response.data)) {
      let dictionary = EnhancedDictionary.enhance(response.data);
      this.setState({dictionary});
    } else {
      this.setState({dictionary: null});
    }
  }

  public render(): ReactNode {
    let node = (
      <Page dictionary={this.state.dictionary} showDictionary={true}>
        <div styleName="description">{this.trans("addCommissionPage.description")}</div>
        <div styleName="form">
          <AddCommissionForm dictionary={this.state.dictionary}/>
        </div>
      </Page>
    );
    return node;
  }

}


type Props = {
};
type State = {
  dictionary: EnhancedDictionary | null
};
type Params = {
  number: string
};