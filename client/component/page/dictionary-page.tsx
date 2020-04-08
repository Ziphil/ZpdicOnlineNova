//

import * as queryParser from "query-string";
import * as react from "react";
import {
  Fragment,
  ReactNode
} from "react";
import {
  Markdown
} from "/client/component/atom";
import {
  StoreComponent
} from "/client/component/component";
import {
  Loading,
  PaginationButton,
  SearchForm,
  WordList
} from "/client/component/compound";
import {
  applyStyle,
  inject,
  route
} from "/client/component/decorator";
import {
  Page
} from "/client/component/page/page";
import {
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
    authorized: false,
    hitSize: 0,
    hitWords: [],
    showsExplanation: true,
    search: "",
    mode: "both",
    type: "prefix",
    page: 0
  };

  public constructor(props: any) {
    super(props);
    this.serializeQuery();
  }

  public async componentDidMount(): Promise<void> {
    let promises = [this.fetchDictionary(), this.checkAuthorization()];
    if (!this.state.showsExplanation) {
      promises.push(this.updateWords());
    }
    let allPromise = Promise.all(promises);
    await allPromise;
  }

  private async fetchDictionary(): Promise<void> {
    let number = +this.props.match!.params.number;
    let response = await this.requestGet("fetchDictionary", {number});
    if (response.status === 200 && !("error" in response.data)) {
      let dictionary = response.data;
      this.setState({dictionary});
    } else {
      this.setState({dictionary: null});
    }
  }

  private async checkAuthorization(): Promise<void> {
    let number = +this.props.match!.params.number;
    let response = await this.requestGet("checkDictionaryAuthorization", {number}, true);
    if (response.status === 200) {
      this.setState({authorized: true});
    }
  }

  private async updateWords(): Promise<void> {
    let number = +this.props.match!.params.number;
    let search = this.state.search;
    let mode = this.state.mode;
    let type = this.state.type;
    let page = this.state.page;
    let offset = page * 40;
    let size = 41;
    let response = await this.requestGet("searchDictionary", {number, search, mode, type, offset, size});
    if (response.status === 200 && !("error" in response.data)) {
      let hitSize = response.data.hitSize;
      let hitWords = response.data.hitWords;
      let showsExplanation = false;
      this.setState({hitSize, hitWords, showsExplanation});
    } else {
      this.setState({hitSize: 0, hitWords: []});
    }
    this.deserializeQuery();
  }

  private serializeQuery(): void {
    let query = queryParser.parse(this.props.location!.search);
    if (typeof query.search === "string") {
      this.state.search = query.search;
      this.state.initialSearch = query.search;
      this.state.showsExplanation = false;
    }
    if (typeof query.mode === "string") {
      this.state.mode = SearchModeUtil.cast(query.mode);
      this.state.initialMode = SearchModeUtil.cast(query.mode);
    }
    if (typeof query.type === "string") {
      this.state.type = SearchTypeUtil.cast(query.type);
      this.state.initialType = SearchTypeUtil.cast(query.type);
    }
    if (typeof query.page === "string") {
      this.state.page = +query.page;
    }
  }

  private deserializeQuery(): void {
    let search = this.state.search;
    let mode = this.state.mode;
    let type = this.state.type;
    let page = this.state.page;
    let queryString = queryParser.stringify({search, mode, type, page});
    this.props.history!.replace({search: queryString});
  }

  private async handleAnySet(search: string, mode: SearchMode, type: SearchType): Promise<void> {
    let page = 0;
    this.setState({search, mode, type, page}, async () => {
      await this.updateWords();
    });
  }

  private handlePageSet(page: number): void {
    this.setState({page}, async () => {
      window.scrollTo(0, 0);
      await this.updateWords();
    });
  }

  public render(): ReactNode {
    let maxPage = Math.max(Math.ceil(this.state.hitSize / 40) - 1, 0);
    let wordListNode;
    if (this.state.showsExplanation) {
      if (this.state.dictionary) {
        wordListNode = (
          <Markdown source={this.state.dictionary!.explanation}/>
        );
      }
    } else {
      wordListNode = (
        <Fragment>
          <div styleName="word-list">
            <WordList words={this.state.hitWords} offset={0} size={40}/>
          </div>
          <div styleName="pagination-button">
            <PaginationButton page={this.state.page} minPage={0} maxPage={maxPage} onSet={this.handlePageSet.bind(this)}/>
          </div>
        </Fragment>
      );
    }
    let node = (
      <Page showsDictionary={true} showsDictionarySetting={this.state.authorized} dictionary={this.state.dictionary}>
        <div styleName="search-form">
          <SearchForm initialSearch={this.state.initialSearch} initialMode={this.state.initialMode} initialType={this.state.initialType} onAnySet={this.handleAnySet.bind(this)}/>
        </div>
        <Loading loading={this.state.dictionary === null}>
          {wordListNode}
        </Loading>
      </Page>
    );
    return node;
  }

}


type Props = {
};
type State = {
  dictionary: SlimeDictionarySkeleton | null,
  authorized: boolean,
  hitSize: number,
  hitWords: Array<SlimeWordSkeleton>,
  showsExplanation: boolean,
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