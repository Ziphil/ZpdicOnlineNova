//

import * as react from "react";
import {
  Fragment,
  MouseEvent,
  ReactElement,
  useCallback,
  useState
} from "react";
import {
  useMount
} from "react-use";
import {
  AsyncOrSync
} from "ts-essentials";
import Loading from "/client/component/compound/loading";
import PaginationButton from "/client/component/compound/pagination-button";
import SearchForm from "/client/component/compound/search-form";
import WordList from "/client/component/compound/word-list";
import {
  create
} from "/client/component/create";
import {
  useDebounce,
  useRequest
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
    dictionary: EnhancedDictionary | null,
    style?: "normal" | "simple",
    showButton?: boolean,
    showDirectionButton?: boolean,
    onSubmit?: (word: Word, direction: "oneway" | "mutual") => void,
    onEditConfirm?: (oldWord: Word, newWord: EditableWord, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>
  }): ReactElement {

    let [parameter, setParameter] = useState<WordParameter>(NormalWordParameter.createEmpty());
    let [page, setPage] = useState(0);
    let [hitResult, setHitResult] = useState<DictionaryHitResult>({words: [[], 0], suggestions: []});
    let [loading, setLoading] = useState(false);
    let {request} = useRequest();

    let updateWordsImmediately = useCallback(async function (overrides?: {parameter?: WordParameter, page?: number}): Promise<void> {
      let number = dictionary?.number;
      if (number !== undefined) {
        let usedParameter = overrides?.parameter ?? parameter;
        let usedPage = overrides?.page ?? page;
        let offset = usedPage * 40;
        let size = 40;
        setLoading(true);
        let response = await request("searchDictionary", {number, parameter: usedParameter, offset, size});
        if (response.status === 200 && !("error" in response.data)) {
          let hitResult = response.data;
          setHitResult(hitResult);
          setLoading(false);
        } else {
          setHitResult({words: [[], 0], suggestions: []});
          setLoading(false);
        }
      }
    }, [dictionary?.number, parameter, page, request]);

    let updateWords = useDebounce(async function (overrides?: {parameter?: WordParameter, page?: number}): Promise<void> {
      await updateWordsImmediately(overrides);
    }, 500, [updateWordsImmediately]);

    let handleParameterSet = useCallback(async function (parameter: WordParameter): Promise<void> {
      let page = 0;
      setParameter(parameter);
      setPage(page);
      await updateWords({parameter, page});
    }, [updateWords]);

    let handlePageSet = useCallback(async function (page: number): Promise<void> {
      setPage(page);
      await updateWordsImmediately({page});
    }, [updateWordsImmediately]);

    useMount(async () => {
      await updateWordsImmediately();
    });

    let innerProps = {dictionary, style, showButton, showDirectionButton, page, hitResult, onSubmit, onEditConfirm, handlePageSet};
    let innerNode = (dictionary !== null) && <WordSearcherWordList {...innerProps}/>;
    let node = (
      <div>
        <Loading loading={dictionary === null}>
          <div styleName="search-form">
            <SearchForm dictionary={dictionary!} parameter={parameter} onParameterSet={handleParameterSet}/>
          </div>
          {innerNode}
        </Loading>
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
    page,
    hitResult,
    onSubmit,
    onEditConfirm,
    handlePageSet
  }: {
    dictionary: EnhancedDictionary | null,
    style: "normal" | "simple",
    showButton: boolean,
    showDirectionButton: boolean,
    page: number,
    hitResult: DictionaryHitResult,
    onSubmit?: (word: Word, direction: "oneway" | "mutual") => void,
    onEditConfirm?: (oldWord: Word, newWord: EditableWord, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
    handlePageSet: (page: number) => Promise<void>
  }): ReactElement {

    let [hitWords, hitSize] = hitResult.words;
    let maxPage = Math.max(Math.ceil(hitSize / 40) - 1, 0);
    let node = (
      <Fragment>
        <div styleName="word-list">
          <WordList
            dictionary={dictionary!}
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
            page={page}
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

export default WordSearcher;