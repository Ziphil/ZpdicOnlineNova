//

import * as react from "react";
import {
  Fragment,
  MouseEvent,
  ReactNode
} from "react";
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
  WithSize
} from "/server/controller/type";
import {
  Dictionary,
  EditWord,
  Suggestion,
  Word
} from "/server/skeleton/dictionary";
import {
  NormalSearchParameter
} from "/server/skeleton/search-parameter";


@route @inject
@applyStyle(require("./word-searcher.scss"))
export class WordSearcher extends StoreComponent<Props, State> {

  public static defaultProps: DefaultProps = {
    style: "normal",
    showButton: false
  };
  public state: State = {
    parameter: {search: "", mode: "both", type: "prefix"},
    page: 0,
    hitResult: {words: [[], 0], suggestions: []}
  };

  public async componentDidMount(): Promise<void> {
    this.updateWordsImmediately();
  }

  private async updateWordsImmediately(): Promise<void> {
    let number = this.props.dictionary?.number;
    if (number !== undefined) {
      let search = this.state.parameter.search;
      let mode = this.state.parameter.mode;
      let type = this.state.parameter.type;
      let page = this.state.page;
      let offset = page * 40;
      let size = 40;
      let response = await this.requestGet("searchDictionary", {number, search, mode, type, offset, size});
      if (response.status === 200 && !("error" in response.data)) {
        let hitResult = response.data;
        this.setState({hitResult});
      } else {
        this.setState({hitResult: {words: [[], 0], suggestions: []}});
      }
    }
  }

  @debounce(500)
  private async updateWords(): Promise<void> {
    await this.updateWordsImmediately();
  }

  private async handleParameterSet(parameter: NormalSearchParameter): Promise<void> {
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
        <div styleName="search-form">
          <SearchForm parameter={this.state.parameter} onParameterSet={this.handleParameterSet.bind(this)}/>
        </div>
        <Loading loading={this.props.dictionary === null}>
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
  onEditConfirm?: (oldWord: Word, newWord: EditWord, event: MouseEvent<HTMLButtonElement>) => void | Promise<void>
};
type DefaultProps = {
  style: "normal" | "simple",
  showButton: boolean
};
type State = {
  parameter: NormalSearchParameter,
  page: number,
  hitResult: {words: WithSize<Word>, suggestions: Array<Suggestion>}
};