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
  style
} from "/client/component/decorator";
import Page from "/client/component/page/page";
import {
  EnhancedDictionary,
  NormalWordParameter,
  Suggestion,
  Word,
  WordParameter
} from "/client/skeleton/dictionary";
import {
  debounce
} from "/client/util/decorator";
import {
  WithSize
} from "/server/controller/internal/type";


@style(require("./dictionary-page.scss"))
export default class DictionaryPage extends Component<Props, State, Params> {

  public state: State = {
    dictionary: null,
    canOwn: false,
    canEdit: false,
    parameter: NormalWordParameter.createEmpty(),
    page: 0,
    showExplanation: true,
    hitResult: {words: [[], 0], suggestions: []},
    loading: false
  };

  public constructor(props: any) {
    super(props);
    this.deserializeQuery(true);
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

  public async componentDidUpdate(previousProps: any): Promise<void> {
    if (this.props.location!.key !== previousProps.location!.key) {
      if (this.props.match!.params.value !== previousProps.match!.params.value) {
        await this.fetchDictionary();
      }
      this.deserializeQuery(false, () => {
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
    let response = await this.request("fetchDictionary", {number, paramName});
    if (response.status === 200 && !("error" in response.data)) {
      let dictionary = EnhancedDictionary.enhance(response.data);
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
        let response = await this.request("checkDictionaryAuthorization", {number, authority}, {ignoreError: true});
        if (response.status === 200) {
          this.setState({canOwn: true}, () => resolve(null));
        }
      }
    });
    let editPromise = new Promise(async (resolve, reject) => {
      if (number !== undefined) {
        let authority = "edit" as const;
        let response = await this.request("checkDictionaryAuthorization", {number, authority}, {ignoreError: true});
        if (response.status === 200) {
          this.setState({canEdit: true}, () => resolve(null));
        }
      }
    });
    await Promise.all([ownPromise, editPromise]);
  }

  private async updateWordsImmediately(serialize: boolean = true): Promise<void> {
    let number = this.state.dictionary?.number;
    if (number !== undefined) {
      let parameter = this.state.parameter;
      let page = this.state.page;
      let offset = page * 40;
      let size = 40;
      this.setState({loading: true});
      let response = await this.request("searchDictionary", {number, parameter, offset, size});
      if (response.status === 200 && !("error" in response.data)) {
        let hitResult = response.data;
        let showExplanation = false;
        this.setState({hitResult, showExplanation, loading: false});
      } else {
        this.setState({hitResult: {words: [[], 0], suggestions: []}, loading: false});
      }
      if (serialize) {
        this.serializeQuery();
      }
    }
  }

  @debounce(500)
  private async updateWords(): Promise<void> {
    await this.updateWordsImmediately();
  }

  private deserializeQuery(first: boolean, callback?: () => void): void {
    let queryString = this.props.location!.search;
    let query = queryParser.parse(queryString);
    let parameter = WordParameter.deserialize(queryString);
    let page = (typeof query.page === "string") ? +query.page : 0;
    let showExplanation = Object.keys(query).length <= 0;
    if (first) {
      this.state = Object.assign(this.state, {parameter, page, showExplanation});
      if (callback) {
        callback();
      }
    } else {
      this.setState({parameter, page, showExplanation}, callback);
    }
  }

  private serializeQuery(): void {
    let queryString = this.state.parameter.serialize() + `&page=${this.state.page}`;
    this.props.history!.replace({search: queryString});
  }

  private async handleParameterSet(parameter: WordParameter): Promise<void> {
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
            onRemoveConfirm={() => this.updateWordsImmediately()}
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
      <Page dictionary={this.state.dictionary} showDictionary={true} showAddLink={this.state.canEdit} showSettingLink={this.state.canOwn}>
        <Loading loading={this.state.dictionary === null}>
          <div styleName="search-form">
            <SearchForm dictionary={this.state.dictionary!} parameter={this.state.parameter} showAdvancedSearch={true} onParameterSet={this.handleParameterSet.bind(this)}/>
          </div>
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
  dictionary: EnhancedDictionary | null,
  canOwn: boolean,
  canEdit: boolean,
  parameter: WordParameter,
  page: number,
  showExplanation: boolean,
  hitResult: {words: WithSize<Word>, suggestions: Array<Suggestion>},
  loading: boolean
};
type Params = {
  value: string
};