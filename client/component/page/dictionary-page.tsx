//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  withRouter
} from "react-router-dom";
import {
  ComponentBase
} from "/client/component/component";
import {
  DictionaryHeader,
  Header
} from "/client/component/compound";
import {
  DictionaryBody,
  MayError
} from "/client/type";
import {
  applyStyle
} from "/client/util/decorator";
import * as http from "/client/util/http";


@applyStyle(require("./dictionary-page.scss"))
class DictionaryPageBase extends ComponentBase<Props, State, Params> {

  public state: State = {
    dictionary: null
  };

  public async componentDidMount(): Promise<void> {
    let number = this.props.match!.params.number;
    let response = await http.get<MayError<DictionaryBody>>("/api/dictionary/info", {number}, [400]);
    let data = response.data;
    if (!("error" in data)) {
      let dictionary = data;
      console.log(dictionary);
      this.setState({dictionary});
    }
  }

  public render(): ReactNode {
    let node = (
      <div styleName="dictionary-page">
        <Header/>
        <DictionaryHeader name={this.state.dictionary?.name || ""}/>
      </div>
    );
    return node;
  }

}


type Props = {
};
type State = {
  dictionary: DictionaryBody | null
};
type Params = {
  number: string
};

export let DictionaryPage = withRouter(DictionaryPageBase);