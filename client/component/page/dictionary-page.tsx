//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  withRouter
} from "react-router-dom";
import {
  Button
} from "/client/component/atom";
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
    words: [],
    search: "",
    mode: "both",
    type: "prefix",
    page: 0
  };

  private async fetchDictionary(): Promise<void> {
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
  }

  private async updateWords(): Promise<void> {
    let number = this.props.match!.params.number;
    let search = this.state.search;
    let mode = this.state.mode;
    let type = this.state.type;
    let offset = this.state.page * 40;
    let size = 40;
    console.log(offset);
    let response = await http.get<any>("/api/dictionary/search", {number, search, mode, type, offset, size}, [400]);
    console.log({number, search, mode, type, offset, size});
    console.log(response.data);
    let data = response.data;
    if (!("error" in data)) {
      let words = data;
      this.setState({words});
    } else {
      this.setState({words: []});
    }
  }

  public async componentDidMount(): Promise<void> {
    let promise = Promise.all([this.fetchDictionary(), this.updateWords()]);
    await promise;
  }

  private async handleAnyChange(search: string, mode: string, type: string): Promise<void> {
    let page = 0;
    this.setState({search, mode, type, page}, async () => {
      await this.updateWords();
    });
  }

  private async movePreviousPage(): Promise<void> {
    let page = this.state.page - 1;
    if (page < 0) {
      page = 0;
    }
    this.setState({page}, async () => {
      await this.updateWords();
    });
  }

  private async moveNextPage(): Promise<void> {
    let page = this.state.page + 1;
    this.setState({page}, async () => {
      await this.updateWords();
    });
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
          <WordList words={this.state.words} offset={0} size={40}/>
        </div>
        <div styleName="page-button">
          <Button label="前ページ" position="left" disabled={this.state.page <= 0} onClick={this.movePreviousPage.bind(this)}/>
          <Button label="次ページ" position="right" onClick={this.moveNextPage.bind(this)}/>
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
  words: Array<any>,
  search: string,
  mode: string,
  type: string,
  page: number
};
type Params = {
  number: string
};

export let DictionaryPage = withRouter(DictionaryPageBase);