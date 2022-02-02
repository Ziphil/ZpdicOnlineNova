//

import {
  Dispatch,
  useCallback
} from "react";
import {
  createGlobalState
} from "react-use";
import type WordEditor from "/client/component/compound/word-editor-beta";


let useRawWordEditorProps = createGlobalState<Array<WordEditorProps>>([]);
let useRawWordEditorOpen = createGlobalState<boolean>(false);

export function useWordEditor(): (props: WordEditorProps) => void {
  let [, setWordEditorProps] = useRawWordEditorProps();
  let [, setWordEditorOpen] = useRawWordEditorOpen();
  let addWordEditor = useCallback(function (props: WordEditorProps): void {
    setWordEditorProps((previousProps) => [...previousProps, props]);
    setWordEditorOpen(true);
  }, [setWordEditorProps, setWordEditorOpen]);
  return addWordEditor;
}

export function useWordEditorProps(): [{wordEditorProps: Array<WordEditorProps>, wordEditorOpen: boolean}, Dispatch<boolean>] {
  let [wordEditorProps] = useRawWordEditorProps();
  let [wordEditorOpen, setWordEditorOpen] = useRawWordEditorOpen();
  return [{wordEditorProps, wordEditorOpen}, setWordEditorOpen];
}

type WordEditorProps = Parameters<typeof WordEditor>[0];