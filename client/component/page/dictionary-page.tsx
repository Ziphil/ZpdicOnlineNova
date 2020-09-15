//

import * as queryParser from "query-string";
import * as react from "react";
import {
  Fragment,
  ReactNode
} from "react";
import Markdown from "/client/component/atom/markdown";
import Component from "/client/component/component";
import Loading from "/client/component/compound/loading";
import PaginationButton from "/client/component/compound/pagination-button";
import SearchForm from "/client/component/compound/search-form";
import SuggestionList from "/client/component/compound/suggestion-list";
import WordList from "/client/component/compound/word-list";
import {
  debounce,
  style
} from "/client/component/decorator";
import Page from "/client/component/page/page";
import {
  WithSize
} from "/server/controller/type";
import {
  Dictionary,
  Suggestion,
  Word
} from "/server/skeleton/dictionary";
import {
  NormalSearchParameter,
  SearchModeUtil,
  SearchTypeUtil
} from "/server/skeleton/search-parameter";


@style(require("./dictionary-page.scss"))
export default class DictionaryPage extends Component<Props, State, Params> {

  public state: State = {
    dictionary: null,
    canOwn: false,
    canEdit: false,
    parameter: {search: "", mode: "both", type: "prefix"},
    page: 0,
    showExplanation: true,
    hitResult: {words: [[], 0], suggestions: []},
    loading: false
  };

  public constructor(props: any) {
    super(props);
    this.serializeQuery(true);
  }

  public async componentDidMount(): Promise<void> {
    await this.fetchDictionary();
    let promises = [this.checkAuthorization()];
    if (!this.state.showExplanation) {
      promises.push(this.updateWordsImmediately(false));
    }
    let allPromise = Promise.all(promises);
    await allPromise;
  }

  public componentDidUpdate(previousProps: any): void {
    if (this.props.location!.key !== previousProps.location!.key) {
      this.serializeQuery(false, () => {
        if (!this.state.showExplanation) {
          this.updateWordsImmediately(false);
        }
      });
    }
  }

  private async fetchDictionary(): Promise<void> {
    let value = this.props.match!.params.value;
    let [number, paramName] = (() => {
      if (value.match(/^\d+$/)) {
        return [+value, undefined] as const;
      } else {
        return [undefined, value] as const;
      }
    })();
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
    let ownPromise = new Promise(async (resolve, reject) => {
      if (number !== undefined) {
        let authority = "own" as const;
        let response = await this.requestGet("checkDictionaryAuthorization", {number, authority}, true);
        if (response.status === 200) {
          this.setState({canOwn: true}, resolve);
        }
      }
    });
    let editPromise = new Promise(async (resolve, reject) => {
      if (number !== undefined) {
        let authority = "edit" as const;
        let response = await this.requestGet("checkDictionaryAuthorization", {number, authority}, true);
        if (response.status === 200) {
          this.setState({canEdit: true}, resolve);
        }
      }
    });
    await Promise.all([ownPromise, editPromise]);
  }

  private async updateWordsImmediately(deserialize: boolean = true): Promise<void> {
    let number = this.state.dictionary?.number;
    if (number !== undefined) {
      let search = this.state.parameter.search;
      let mode = this.state.parameter.mode;
      let type = this.state.parameter.type;
      let page = this.state.page;
      let offset = page * 40;
      let size = 40;
      this.setState({loading: true});
      let response = await this.requestGet("searchDictionary", {number, search, mode, type, offset, size});
      if (response.status === 200 && !("error" in response.data)) {
        let hitResult = response.data;
        let showExplanation = false;
        this.setState({hitResult, showExplanation, loading: false});
      } else {
        this.setState({hitResult: {words: [[], 0], suggestions: []}, loading: false});
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
    nextState.parameter = {search: "", mode: "both", type: "prefix"};
    if (typeof query.search === "string") {
      nextState.parameter.search = query.search;
      nextState.showExplanation = false;
    } else {
      nextState.parameter.search = "";
      nextState.showExplanation = true;
    }
    if (typeof query.mode === "string") {
      nextState.parameter.mode = SearchModeUtil.cast(query.mode);
    } else {
      nextState.parameter.mode = "both";
    }
    if (typeof query.type === "string") {
      nextState.parameter.type = SearchTypeUtil.cast(query.type);
    } else {
      nextState.parameter.type = "prefix";
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
    let search = this.state.parameter.search;
    let mode = this.state.parameter.mode;
    let type = this.state.parameter.type;
    let page = this.state.page;
    let queryString = queryParser.stringify({search, mode, type, page});
    this.props.history!.replace({search: queryString});
  }

  private async handleParameterSet(parameter: NormalSearchParameter): Promise<void> {
    let page = 0;
    this.setState({parameter, page}, async () => {
      await this.updateWords();
    });
  }

  private handlePageSet(page: number): void {
    this.setState({page}, async () => {
      window.scrollTo(0, 0);
      await this.updateWordsImmediately(true);
    });
  }

  private renderWordList(): ReactNode {
    let [hitWords, hitSize] = this.state.hitResult.words;
    let hitSuggestions = this.state.hitResult.suggestions;
    let maxPage = Math.max(Math.ceil(hitSize / 40) - 1, 0);
    let node = (
      <Fragment>
        <div styleName="suggestion-list">
          <SuggestionList
            dictionary={this.state.dictionary!}
            suggestions={hitSuggestions}
          />
        </div>
        <div styleName="word-list">
          <WordList
            dictionary={this.state.dictionary!}
            words={hitWords}
            showEditLink={this.state.canEdit}
            offset={0}
            size={40}
            onEditConfirm={() => this.updateWordsImmediately()}
            onDeleteConfirm={() => this.updateWordsImmediately()}
          />
        </div>
        <div styleName="pagination">
          <PaginationButton page={this.state.page} minPage={0} maxPage={maxPage} onSet={this.handlePageSet.bind(this)}/>
        </div>
      </Fragment>
    );
    return node;
  }

  public render(): ReactNode {
    let innerNode = (this.state.dictionary !== null) && (
      (this.state.showExplanation) ? <Markdown source={this.state.dictionary.explanation ?? ""}/> : this.renderWordList()
    );
    let node = (
      <Page dictionary={this.state.dictionary} showDictionary={true} showEditLink={this.state.canEdit} showSettingLink={this.state.canOwn}>
        <div styleName="search-form">
          <SearchForm parameter={this.state.parameter} onParameterSet={this.handleParameterSet.bind(this)}/>
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
  dictionary: Dictionary | null,
  canOwn: boolean,
  canEdit: boolean,
  parameter: NormalSearchParameter,
  page: number,
  showExplanation: boolean,
  hitResult: {words: WithSize<Word>, suggestions: Array<Suggestion>},
  loading: boolean
};
type Params = {
  value: string
};