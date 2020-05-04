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
  debounce,
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
    search: "",
    mode: "both",
    type: "prefix",
    page: 0,
    showsExplanation: true,
    hitSize: 0,
    hitWords: []
  };

  public constructor(props: any) {
    super(props);
    this.serializeQuery(true);
  }

  public async componentDidMount(): Promise<void> {
    await this.fetchDictionary();
    let promises = [this.checkAuthorization()];
    if (!this.state.showsExplanation) {
      promises.push(this.updateWordsImmediately(false));
    }
    let allPromise = Promise.all(promises);
    await allPromise;
  }

  public componentDidUpdate(previousProps: any): void {
    if (this.props.location!.key !== previousProps.location!.key) {
      this.serializeQuery(false, () => {
        if (!this.state.showsExplanation) {
          this.updateWordsImmediately(false);
        }
      });
    }
  }

  private async fetchDictionary(): Promise<void> {
    let value = this.props.match!.params.value;
    let number;
    let paramName;
    if (value.match(/^\d+$/)) {
      number = +value;
    } else {
      paramName = value;
    }
    let response = await this.requestGet("fetchDictionary", {number, paramName});
    if (response.status === 200 && !("error" in response.data)) {
      let dictionary = response.data;
      this.setState({dictionary});
    } else {
      this.setState({dictionary: null});
    }
  }

  private async checkAuthorization(): Promise<void> {
    let number = this.state.dictionary?.number;
    if (number !== undefined) {
      let response = await this.requestGet("checkDictionaryAuthorization", {number}, true);
      if (response.status === 200) {
        this.setState({authorized: true});
      }
    }
  }

  private async updateWordsImmediately(deserialize: boolean = true): Promise<void> {
    let number = this.state.dictionary?.number;
    if (number !== undefined) {
      let search = this.state.search;
      let mode = this.state.mode;
      let type = this.state.type;
      let page = this.state.page;
      let offset = page * 40;
      let size = 40;
      let response = await this.requestGet("searchDictionary", {number, search, mode, type, offset, size});
      if (response.status === 200 && !("error" in response.data)) {
        let hitSize = response.data.hitSize;
        let hitWords = response.data.hitWords;
        let showsExplanation = false;
        this.setState({hitSize, hitWords, showsExplanation});
      } else {
        this.setState({hitSize: 0, hitWords: []});
      }
      if (deserialize) {
        this.deserializeQuery();
      }
    }
  }

  @debounce(500)
  private async updateWords(): Promise<void> {
    await this.updateWordsImmediately();
  }

  private serializeQuery(first: boolean, callback?: () => void): void {
    let query = queryParser.parse(this.props.location!.search);
    let nextState = {} as any;
    if (typeof query.search === "string") {
      nextState.search = query.search;
      nextState.showsExplanation = false;
    } else {
      nextState.search = "";
      nextState.showsExplanation = true;
    }
    if (typeof query.mode === "string") {
      nextState.mode = SearchModeUtil.cast(query.mode);
    } else {
      nextState.mode = "both";
    }
    if (typeof query.type === "string") {
      nextState.type = SearchTypeUtil.cast(query.type);
    } else {
      nextState.type = "prefix";
    }
    if (typeof query.page === "string") {
      nextState.page = +query.page;
    } else {
      nextState.page = 0;
    }
    if (first) {
      this.state = Object.assign(this.state, nextState);
      if (callback) {
        callback();
      }
    } else {
      this.setState(nextState, callback);
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

  private async handleSomeSearchSet(someSearch: {search?: string, mode?: SearchMode, type?: SearchType}): Promise<void> {
    let page = 0;
    let anySomeSearch = someSearch as any;
    this.setState({...anySomeSearch, page}, async () => {
      await this.updateWords();
    });
  }

  private handlePageSet(page: number): void {
    this.setState({page}, async () => {
      window.scrollTo(0, 0);
      await this.updateWordsImmediately(true);
    });
  }

  private renderWordListNode(): ReactNode {
    let maxPage = Math.max(Math.ceil(this.state.hitSize / 40) - 1, 0);
    let node = (
      <Fragment>
        <div styleName="word-list">
          <WordList
            dictionary={this.state.dictionary!}
            words={this.state.hitWords}
            authorized={this.state.authorized}
            offset={0}
            size={40}
            onEditConfirm={() => this.updateWordsImmediately()}
            onDeleteConfirm={() => this.updateWordsImmediately()}
          />
        </div>
        <div styleName="pagination-button">
          <PaginationButton page={this.state.page} minPage={0} maxPage={maxPage} onSet={this.handlePageSet.bind(this)}/>
        </div>
      </Fragment>
    );
    return node;
  }

  public render(): ReactNode {
    let innerNode = (this.state.dictionary !== null) && (
      (this.state.showsExplanation) ? <Markdown source={this.state.dictionary.explanation}/> : this.renderWordListNode()
    );
    let node = (
      <Page showsDictionary={true} showsDictionarySetting={this.state.authorized} dictionary={this.state.dictionary}>
        <div styleName="search-form">
          <SearchForm search={this.state.search} mode={this.state.mode} type={this.state.type} onSomeSet={this.handleSomeSearchSet.bind(this)}/>
        </div>
        <Loading loading={this.state.dictionary === null}>
          {innerNode}
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
  search: string,
  mode: SearchMode,
  type: SearchType
  page: number,
  showsExplanation: boolean,
  hitSize: number,
  hitWords: Array<SlimeWordSkeleton>
};
type Params = {
  value: string
};