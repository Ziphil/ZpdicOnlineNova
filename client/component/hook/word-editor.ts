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


let useRawWordEditorProps = createGlobalState<Array<TempWordEditorProps>>([]);
let useRawWordEditorOpen = createGlobalState(false);

export function useWordEditor(): (props: WordEditorProps) => void {
  let [, setWordEditorProps] = useRawWordEditorProps();
  let [, setWordEditorOpen] = useRawWordEditorOpen();
  let addWordEditor = useCallback(function (props: WordEditorProps): void {
    let id = nanoid();
    let onEditConfirm = async function (word: EditableWord, event: MouseEvent<HTMLButtonElement>): Promise<void> {
      await props.onEditConfirm?.(word, event);
      setWordEditorProps((previousProps) => {
        let nextProps = previousProps.filter((previousProp) => previousProp.id !== id);
        if (nextProps.length <= 0) {
          setWordEditorOpen(false);
        }
        return nextProps;
      });
    };
    let onDiscardConfirm = async function (event: MouseEvent<HTMLButtonElement>): Promise<void> {
      await props.onDiscardConfirm?.(event);
      setWordEditorProps((previousProps) => {
        let nextProps = previousProps.filter((previousProp) => previousProp.id !== id);
        if (nextProps.length < 0) {
          setWordEditorOpen(false);
        }
        return nextProps;
      });
    };
    setWordEditorProps((previousProps) => [...previousProps, {id, ...props, onEditConfirm, onDiscardConfirm}]);
    setWordEditorOpen(true);
  }, [setWordEditorProps, setWordEditorOpen]);
  return addWordEditor;
}

export function useWordEditorProps(): [{wordEditorProps: Array<TempWordEditorProps>, wordEditorOpen: boolean}, Dispatch<SetStateAction<boolean>>] {
  let [wordEditorProps] = useRawWordEditorProps();
  let [wordEditorOpen, setWordEditorOpen] = useRawWordEditorOpen();
  return [{wordEditorProps, wordEditorOpen}, setWordEditorOpen];
}

type WordEditorProps = Parameters<typeof WordEditor>[0];
type TempWordEditorProps = WordEditorProps & {id: string};