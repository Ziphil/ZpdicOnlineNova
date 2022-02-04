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
import {
  AsyncOrSync
} from "ts-essentials";
import type WordEditor from "/client/component/compound/word-editor-beta";
import {
  EditableWord
} from "/client/skeleton/dictionary";


export function createEditor<I, P extends EditorProps<I>>(): [CreateEditorHook<P>, CreateEditorPropsHook<P>] {
  let useRawEditorProps = createGlobalState<Array<P & {id: string}>>([]);
  let useRawEditorOpen = createGlobalState(false);
  let useEditor = function (): (props: P) => void {
    let [, setEditorProps] = useRawEditorProps();
    let [, setEditorOpen] = useRawEditorOpen();
    let addEditor = useCallback(function (props: P): void {
      let id = nanoid();
      let onEditConfirm = async function (item: I, event: MouseEvent<HTMLButtonElement>): Promise<void> {
        await props.onEditConfirm?.(item, event);
        setEditorProps((previousProps) => {
          let nextProps = previousProps.filter((previousProp) => previousProp.id !== id);
          if (nextProps.length <= 0) {
            setEditorOpen(false);
          }
          return nextProps;
        });
      };
      let onDiscardConfirm = async function (event: MouseEvent<HTMLButtonElement>): Promise<void> {
        await props.onDiscardConfirm?.(event);
        setEditorProps((previousProps) => {
          let nextProps = previousProps.filter((previousProp) => previousProp.id !== id);
          if (nextProps.length <= 0) {
            setEditorOpen(false);
          }
          return nextProps;
        });
      };
      let onCancel = async function (event: MouseEvent<HTMLButtonElement>): Promise<void> {
        await props.onCancel?.(event);
        setEditorProps((previousProps) => {
          let nextProps = previousProps.filter((previousProp) => previousProp.id !== id);
          if (nextProps.length <= 0) {
            setEditorOpen(false);
          }
          return nextProps;
        });
      };
      setEditorProps((previousProps) => [...previousProps, {id, ...props, onEditConfirm, onDiscardConfirm, onCancel}]);
      setEditorOpen(true);
    }, [setEditorProps, setEditorOpen]);
    return addEditor;
  };
  let useEditorProps = function (): [Array<P & {id: string}>, boolean, Dispatch<SetStateAction<boolean>>] {
    let [editorProps] = useRawEditorProps();
    let [editorOpen, setEditorOpen] = useRawEditorOpen();
    return [editorProps, editorOpen, setEditorOpen];
  };
  return [useEditor, useEditorProps];
}

export let [useWordEditor, useWordEditorProps] = createEditor<EditableWord, Parameters<typeof WordEditor>[0]>();

type EditorProps<I> = {
  onEditConfirm?: (item: I, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
  onDiscardConfirm?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
  onCancel?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
};
type CreateEditorHook<P> = () => (props: P) => void;
type CreateEditorPropsHook<P> = () => [Array<P & {id: string}>, boolean, Dispatch<SetStateAction<boolean>>];