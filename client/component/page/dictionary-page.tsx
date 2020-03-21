//

import * as queryParser from "query-string";
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
  SearchModeUtil,
  SearchType,
  SearchTypeUtil
} from "/server/model/dictionary/search-parameter";
import {
  SlimeDictionarySkeleton,
  SlimeWordSkeleton
} from "/server/skeleton/dictionary/slime";


@route @inject
@applyStyle(require("./dictionary-page.scss"))
export class DictionaryPage extends StoreComponent<Props, State, Params> {

  public state: State = {
    dictionary: null,
    hitWords: [],
    search: "",
    mode: "both",
    type: "prefix",
    page: 0
  };

  public constructor(props: Props) {
    super(props);
    let query = queryParser.parse(this.props.location!.search);
    if (typeof query.search === "string") {
      this.state.initialSearch = query.search;
      this.state.search = query.search;
    }
    if (typeof query.mode === "string") {
      this.state.initialMode = SearchModeUtil.cast(query.mode);
      this.state.mode = SearchModeUtil.cast(query.mode);
    }
    if (typeof query.type === "string") {
      this.state.initialType = SearchTypeUtil.cast(query.type);
      this.state.type = SearchTypeUtil.cast(query.type);
    }
  }

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
      let hitWords = this.state.dictionary.search(parameter);
      let queryString = queryParser.stringify({search, mode, type});
      this.setState({hitWords});
      this.props.history!.replace({search: queryString});
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
        <DictionaryHeader dictionary={this.state.dictionary}/>
        <PopupInformationPane/>
        <div styleName="content">
          <div styleName="search-form">
            <SearchForm initialSearch={this.state.initialSearch} initialMode={this.state.initialMode} initialType={this.state.initialType} onAnySet={this.handleAnySet.bind(this)}/>
          </div>
          <Loading loading={this.state.dictionary === null}>
            <div styleName="word-list">
              <WordList words={this.state.hitWords} offset={offset} size={size}/>
            </div>
            <div styleName="page-button">
              <Button label="前ページ" position="left" disabled={this.state.page <= 0} onClick={this.movePreviousPage.bind(this)}/>
              <Button label="次ページ" position="right" disabled={this.state.hitWords.length <= offset + size} onClick={this.moveNextPage.bind(this)}/>
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
  hitWords: Array<SlimeWordSkeleton>,
  search: string,
  mode: SearchMode,
  type: SearchType,
  initialSearch?: string,
  initialMode?: SearchMode,
  initialType?: SearchType,
  page: number
};
type Params = {
  number: string
};