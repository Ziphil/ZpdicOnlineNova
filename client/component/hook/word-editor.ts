//

import {
  nanoid
} from "nanoid";
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback
} from "react";
import {
  createGlobalState
} from "react-use";
import type WordEditor from "/client/component/compound/word-editor-beta";
import {
  EditableWord
} from "/client/skeleton/dictionary";


let useRawWordEditorProps = createGlobalState<Array<WordEditorProps & {id: string}>>([]);
let useRawWordEditorOpen = createGlobalState<boolean>(false);

export function useWordEditor(): (props: WordEditorProps) => void {
  let [, setWordEditorProps] = useRawWordEditorProps();
  let [, setWordEditorOpen] = useRawWordEditorOpen();
  let addWordEditor = useCallback(function (props: WordEditorProps): void {
    let id = nanoid();
    let onEditConfirm = async function (word: EditableWord, event: MouseEvent<HTMLButtonElement>) {
      await props.onEditConfirm?.(word, event);
      setWordEditorProps((previousProps) => previousProps.filter((previousProp) => previousProp.id !== id));
    };
    let onDiscardConfirm = async function (event: MouseEvent<HTMLButtonElement>) {
      await props.onDiscardConfirm?.(event);
      setWordEditorProps((previousProps) => previousProps.filter((previousProp) => previousProp.id !== id));
    };
    setWordEditorProps((previousProps) => [...previousProps, {id, ...props, onEditConfirm, onDiscardConfirm}]);
    setWordEditorOpen(true);
  }, [setWordEditorProps, setWordEditorOpen]);
  return addWordEditor;
}

export function useWordEditorProps(): [{wordEditorProps: Array<WordEditorProps & {id: string}>, wordEditorOpen: boolean}, Dispatch<SetStateAction<boolean>>] {
  let [wordEditorProps] = useRawWordEditorProps();
  let [wordEditorOpen, setWordEditorOpen] = useRawWordEditorOpen();
  return [{wordEditorProps, wordEditorOpen}, setWordEditorOpen];
}

type WordEditorProps = Parameters<typeof WordEditor>[0];