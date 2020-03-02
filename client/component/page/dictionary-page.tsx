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
  Header,
  SearchForm,
  WordList
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
    dictionary: null,
    words: []
  };

  public async componentDidMount(): Promise<void> {
    let number = this.props.match!.params.number;
    let response = await http.get<MayError<DictionaryBody>>("/api/dictionary/info", {number}, [400]);
    let data = response.data;
    if (!("error" in data)) {
      let dictionary = data;
      console.log(dictionary);
      this.setState({dictionary});
    } else {
      this.setState({dictionary: null});
    }
    await this.handleAnyChange("", "both", "prefix");
  }

  private async handleAnyChange(search: string, mode: string, type: string): Promise<void> {
    let number = this.props.match!.params.number;
    let firstIndex = 0;
    let size = 40;
    let response = await http.get<any>("/api/dictionary/search", {number, search, mode, type, firstIndex, size}, [400]);
    let data = response.data;
    if (!("error" in data)) {
      let words = data;
      this.setState({words});
    } else {
      this.setState({words: []});
    }
  }

  public render(): ReactNode {
    let node = (
      <div styleName="dictionary-page">
        <Header/>
        <DictionaryHeader name={this.state.dictionary?.name || ""}/>
        <div styleName="search-form">
          <SearchForm onAnyChange={this.handleAnyChange.bind(this)}/>
        </div>
        <div styleName="word-list">
          <WordList words={this.state.words} firstIndex={0} size={40}/>
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
};
type State = {
  dictionary: DictionaryBody | null,
  words: Array<any>
};
type Params = {
  number: string
};

export let DictionaryPage = withRouter(DictionaryPageBase);