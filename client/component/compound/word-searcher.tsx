//

import * as react from "react";
import {
  Fragment,
  MouseEvent,
  ReactNode
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Component from "/client/component/component";
import Loading from "/client/component/compound/loading";
import PaginationButton from "/client/component/compound/pagination-button";
import SearchForm from "/client/component/compound/search-form";
import WordList from "/client/component/compound/word-list";
import {
  style
} from "/client/component/decorator";
import {
  Dictionary,
  EditWord,
  NormalSearchParameter,
  SearchParameter,
  Suggestion,
  Word
} from "/client/skeleton/dictionary";
import {
  debounce
} from "/client/util/decorator";
import {
  WithSize
} from "/server/controller/interface/type";


@style(require("./word-searcher.scss"))
export default class WordSearcher extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    style: "normal",
    showButton: false
  };
  public state: State = {
    parameter: NormalSearchParameter.createEmpty(),
    page: 0,
    hitResult: {words: [[], 0], suggestions: []},
    loading: false
  };

  public async componentDidMount(): Promise<void> {
    this.updateWordsImmediately();
  }

  private async updateWordsImmediately(): Promise<void> {
    let number = this.props.dictionary?.number;
    if (number !== undefined) {
      let parameter = this.state.parameter;
      let page = this.state.page;
      let offset = page * 40;
      let size = 40;
      this.setState({loading: true});
      let response = await this.requestPost("searchDictionary", {number, parameter, offset, size});
      if (response.status === 200 && !("error" in response.data)) {
        let hitResult = response.data;
        this.setState({hitResult, loading: true});
      } else {
        this.setState({hitResult: {words: [[], 0], suggestions: []}, loading: true});
      }
    }
  }

  @debounce(500)
  private async updateWords(): Promise<void> {
    await this.updateWordsImmediately();
  }

  private async handleParameterSet(parameter: SearchParameter): Promise<void> {
    let page = 0;
    this.setState({parameter, page}, async () => {
      await this.updateWords();
    });
  }

  private handlePageSet(page: number): void {
    this.setState({page}, async () => {
      await this.updateWordsImmediately();
    });
  }

  private renderWordList(): ReactNode {
    let [hitWords, hitSize] = this.state.hitResult.words;
    let maxPage = Math.max(Math.ceil(hitSize / 40) - 1, 0);
    let node = (
      <Fragment>
        <div styleName="word-list">
          <WordList
            dictionary={this.props.dictionary!}
            words={hitWords}
            style={this.props.style}
            showButton={this.props.showButton}
            offset={0}
            size={40}
            onSubmit={this.props.onSubmit}
            onEditConfirm={this.props.onEditConfirm}
          />
        </div>
        <div styleName="pagination">
          <PaginationButton
            page={this.state.page}
            minPage={0}
            maxPage={maxPage}
            onSet={this.handlePageSet.bind(this)}
          />
        </div>
      </Fragment>
    );
    return node;
  }

  public render(): ReactNode {
    let innerNode = (this.props.dictionary !== null) && this.renderWordList();
    let node = (
      <div>
        <Loading loading={this.props.dictionary === null}>
          <div styleName="search-form">
            <SearchForm dictionary={this.props.dictionary} parameter={this.state.parameter} onParameterSet={this.handleParameterSet.bind(this)}/>
          </div>
          {innerNode}
        </Loading>
      </div>
    );
    return node;
  }

}


type Props = {
  dictionary: Dictionary,
  style: "normal" | "simple",
  showButton: boolean,
  onSubmit?: (word: Word, event: MouseEvent<HTMLButtonElement>) => void,
  onEditConfirm?: (oldWord: Word, newWord: EditWord, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>
};
type DefaultProps = {
  style: "normal" | "simple",
  showButton: boolean
};
type State = {
  parameter: SearchParameter,
  page: number,
  hitResult: {words: WithSize<Word>, suggestions: Array<Suggestion>},
  loading: boolean
};