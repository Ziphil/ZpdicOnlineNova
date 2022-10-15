//

import {
  Fragment,
  MouseEvent,
  ReactElement,
  useCallback
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import PaginationButton from "/client/component/compound/pagination-button";
import WordList from "/client/component/compound/word-list";
import WordSearchForm from "/client/component/compound/word-search-form";
import {
  create
} from "/client/component/create";
import {
  useDebouncedState,
  useQuery
} from "/client/component/hook";
import {
  EditableWord,
  EnhancedDictionary,
  NormalWordParameter,
  Suggestion,
  Word,
  WordParameter
} from "/client/skeleton/dictionary";
import {
  calcOffset
} from "/client/util/misc";
import {
  WithSize
} from "/server/controller/internal/type";


const WordSearcher = create(
  require("./word-searcher.scss"), "WordSearcher",
  function ({
    dictionary,
    style = "normal",
    showButton = false,
    showDirectionButton = false,
    onSubmit,
    onEditConfirm
  }: {
    dictionary: EnhancedDictionary,
    style?: "normal" | "simple",
    showButton?: boolean,
    showDirectionButton?: boolean,
    onSubmit?: (word: Word, direction: "oneway" | "mutual") => void,
    onEditConfirm?: (oldWord: Word, newWord: EditableWord, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>
  }): ReactElement {

    const [query, debouncedQuery, setQuery] = useDebouncedState<DictionaryQuery>({parameter: NormalWordParameter.createEmpty(), page: 0}, 500);

    const handleParameterSet = useCallback(function (parameter: WordParameter): void {
      setQuery({parameter, page: 0});
    }, [setQuery]);

    const handlePageSet = useCallback(function (page: number): void {
      setQuery((query) => ({...query, page}));
    }, [setQuery]);

    const node = (
      <div>
        <div styleName="search-form">
          <WordSearchForm dictionary={dictionary} parameter={query.parameter} onParameterSet={handleParameterSet}/>
        </div>
        <WordSearcherWordList {...{dictionary, style, showButton, showDirectionButton, query, debouncedQuery, onSubmit, onEditConfirm, handlePageSet}}/>
      </div>
    );
    return node;

  }
);


const WordSearcherWordList = create(
  require("./word-searcher.scss"),
  function ({
    dictionary,
    style,
    showButton,
    showDirectionButton,
    query,
    debouncedQuery,
    onSubmit,
    onEditConfirm,
    handlePageSet
  }: {
    dictionary: EnhancedDictionary,
    style: "normal" | "simple",
    showButton: boolean,
    showDirectionButton: boolean,
    query: DictionaryQuery,
    debouncedQuery: DictionaryQuery,
    onSubmit?: (word: Word, direction: "oneway" | "mutual") => void,
    onEditConfirm?: (oldWord: Word, newWord: EditableWord, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
    handlePageSet: (page: number) => unknown
  }): ReactElement {

    const [hitResult] = useQuery("searchWord", {number: dictionary.number, parameter: debouncedQuery.parameter, ...calcOffset(query.page, 40)}, {keepPreviousData: true});

    const [hitWords, hitSize] = hitResult?.words ?? [[], 0];
    const maxPage = Math.max(Math.ceil(hitSize / 40) - 1, 0);
    const node = (
      <Fragment>
        <div styleName="word-list">
          <WordList
            dictionary={dictionary}
            words={hitWords}
            style={style}
            showButton={showButton}
            showDirectionButton={showDirectionButton}
            offset={0}
            size={40}
            onSubmit={onSubmit}
            onEditConfirm={onEditConfirm}
          />
        </div>
        <div styleName="pagination">
          <PaginationButton
            page={query.page}
            minPage={0}
            maxPage={maxPage}
            onSet={handlePageSet}
          />
        </div>
      </Fragment>
    );
    return node;

  }
);


export type DictionaryHitResult = {words: WithSize<Word>, suggestions: Array<Suggestion>};
export type DictionaryQuery = {parameter: WordParameter, page: number};

export default WordSearcher;