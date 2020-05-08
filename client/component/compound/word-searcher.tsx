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
  SearchMode,
  SearchType
} from "/server/model/search-parameter";
import {
  Dictionary,
  EditWord,
  Word
} from "/server/skeleton/dictionary";


@route @inject
@applyStyle(require("./word-searcher.scss"))
export class WordSearcher extends StoreComponent<Props, State> {

  public static defaultProps: Partial<Props> = {
    style: "normal",
    showButton: false
  };
  public state: State = {
    search: "",
    mode: "both",
    type: "prefix",
    page: 0,
    hitSize: 0,
    hitWords: []
  };

  public async componentDidMount(): Promise<void> {
    this.updateWordsImmediately();
  }

  private async updateWordsImmediately(): Promise<void> {
    let number = this.props.dictionary?.number;
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
        this.setState({hitSize, hitWords});
      } else {
        this.setState({hitSize: 0, hitWords: []});
      }
    }
  }

  @debounce(500)
  private async updateWords(): Promise<void> {
    await this.updateWordsImmediately();
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
      await this.updateWordsImmediately();
    });
  }

  private renderWordList(): ReactNode {
    let maxPage = Math.max(Math.ceil(this.state.hitSize / 40) - 1, 0);
    let node = (
      <Fragment>
        <div styleName="word-list">
          <WordList
            dictionary={this.props.dictionary!}
            words={this.state.hitWords}
            style={this.props.style}
            authorized={this.props.authorized}
            showButton={this.props.showButton}
            offset={0}
            size={40}
            onSubmit={this.props.onSubmit}
            onEditConfirm={this.props.onEditConfirm}
          />
        </div>
        <div styleName="pagination-button">
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
          <SearchForm search={this.state.search} mode={this.state.mode} type={this.state.type} onSomeSet={this.handleSomeSearchSet.bind(this)}/>
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
  authorized: boolean,
  showButton: boolean,
  onSubmit?: (word: Word, event: MouseEvent<HTMLButtonElement>) => void,
  onEditConfirm?: (oldWord: Word, newWord: EditWord, event: MouseEvent<HTMLButtonElement>) => void | Promise<void>
};
type State = {
  search: string,
  mode: SearchMode,
  type: SearchType
  page: number,
  hitSize: number,
  hitWords: Array<Word>
};