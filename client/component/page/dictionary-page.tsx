//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  Button
} from "/client/component/atom";
import {
  StoreComponent
} from "/client/component/component";
import {
  DictionaryHeader,
  Header,
  Loading,
  PopupInformationPane,
  SearchForm,
  WordList
} from "/client/component/compound";
import {
  applyStyle,
  inject,
  route
} from "/client/component/decorator";
import {
  NormalSearchParameter,
  SearchMode,
  SearchType
} from "/server/model/dictionary/search-parameter";
import {
  SlimeDictionarySkeleton
} from "/server/skeleton/dictionary/slime";


@route @inject
@applyStyle(require("./dictionary-page.scss"))
export class DictionaryPage extends StoreComponent<Props, State, Params> {

  public state: State = {
    dictionary: null,
    words: [],
    search: "",
    mode: "both",
    type: "prefix",
    page: 0
  };

  private async fetchDictionary(): Promise<void> {
    let number = +this.props.match!.params.number;
    let response = await this.requestGet("fetchWholeDictionary", {number});
    if (response.status === 200 && !("error" in response.data)) {
      let dictionary = SlimeDictionarySkeleton.of(response.data);
      this.setState({dictionary});
    } else {
      this.setState({dictionary: null});
    }
  }

  private updateWords(): void {
    let search = this.state.search;
    let mode = this.state.mode;
    let type = this.state.type;
    let parameter = new NormalSearchParameter(search, mode, type);
    if (this.state.dictionary) {
      let words = this.state.dictionary.search(parameter);
      this.setState({words});
    }
  }

  public async componentDidMount(): Promise<void> {
    await this.fetchDictionary();
    this.updateWords();
  }

  private async handleAnySet(search: string, mode: SearchMode, type: SearchType): Promise<void> {
    let page = 0;
    this.setState({search, mode, type, page}, () => {
      this.updateWords();
    });
  }

  private async movePreviousPage(): Promise<void> {
    let page = this.state.page - 1;
    if (page < 0) {
      page = 0;
    }
    this.setState({page}, () => {
      window.scrollTo(0, 0);
      this.updateWords();
    });
  }

  private async moveNextPage(): Promise<void> {
    let page = this.state.page + 1;
    this.setState({page}, () => {
      window.scrollTo(0, 0);
      this.updateWords();
    });
  }

  public render(): ReactNode {
    let offset = this.state.page * 40;
    let size = 40;
    let node = (
      <div styleName="page">
        <Header/>
        <DictionaryHeader name={this.state.dictionary?.name || ""}/>
        <PopupInformationPane/>
        <div styleName="content">
          <div styleName="search-form">
            <SearchForm onAnySet={this.handleAnySet.bind(this)}/>
          </div>
          <Loading loading={this.state.dictionary === null}>
            <div styleName="word-list">
              <WordList words={this.state.words} offset={offset} size={size}/>
            </div>
            <div styleName="page-button">
              <Button label="前ページ" position="left" disabled={this.state.page <= 0} onClick={this.movePreviousPage.bind(this)}/>
              <Button label="次ページ" position="right" disabled={this.state.words.length <= offset + size} onClick={this.moveNextPage.bind(this)}/>
            </div>
          </Loading>
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
};
type State = {
  dictionary: SlimeDictionarySkeleton | null,
  words: Array<any>,
  search: string,
  mode: SearchMode,
  type: SearchType,
  page: number
};
type Params = {
  number: string
};