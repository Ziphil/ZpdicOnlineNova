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
import WordList from "/client/component/compound/word-list";
import WordSearchForm from "/client/component/compound/word-search-form";
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

    const [parameter, setParameter] = useState<WordParameter>(NormalWordParameter.createEmpty());
    const [page, setPage] = useState(0);
    const [hitResult, setHitResult] = useState<DictionaryHitResult>({words: [[], 0], suggestions: []});
    const [loading, setLoading] = useState(false);
    const {request} = useRequest();

    const updateWordsImmediately = useCallback(async function (overrides?: {parameter?: WordParameter, page?: number}): Promise<void> {
      const number = dictionary?.number;
      if (number !== undefined) {
        const usedParameter = overrides?.parameter ?? parameter;
        const usedPage = overrides?.page ?? page;
        const offset = usedPage * 40;
        const size = 40;
        setLoading(true);
        const response = await request("searchDictionary", {number, parameter: usedParameter, offset, size});
        if (response.status === 200 && !("error" in response.data)) {
          const hitResult = response.data;
          setHitResult(hitResult);
          setLoading(false);
        } else {
          setHitResult({words: [[], 0], suggestions: []});
          setLoading(false);
        }
      }
    }, [dictionary?.number, parameter, page, request]);

    const updateWords = useDebounce(async function (overrides?: {parameter?: WordParameter, page?: number}): Promise<void> {
      await updateWordsImmediately(overrides);
    }, 500, [updateWordsImmediately]);

    const handleParameterSet = useCallback(async function (parameter: WordParameter): Promise<void> {
      const page = 0;
      setParameter(parameter);
      setPage(page);
      await updateWords({parameter, page});
    }, [updateWords]);

    const handlePageSet = useCallback(async function (page: number): Promise<void> {
      setPage(page);
      await updateWordsImmediately({page});
    }, [updateWordsImmediately]);

    useMount(async () => {
      await updateWordsImmediately();
    });

    const innerProps = {dictionary, style, showButton, showDirectionButton, page, hitResult, onSubmit, onEditConfirm, handlePageSet};
    const innerNode = (dictionary !== null) && <WordSearcherWordList {...innerProps}/>;
    const node = (
      <div>
        <Loading loading={dictionary === null}>
          <div styleName="search-form">
            <WordSearchForm dictionary={dictionary!} parameter={parameter} onParameterSet={handleParameterSet}/>
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

    const [hitWords, hitSize] = hitResult.words;
    const maxPage = Math.max(Math.ceil(hitSize / 40) - 1, 0);
    const node = (
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