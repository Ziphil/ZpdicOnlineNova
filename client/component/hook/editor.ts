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
import type ExampleEditor from "/client/component/compound/example-editor-beta";
import type WordEditor from "/client/component/compound/word-editor-beta";
import {
  EditableExample,
  EditableWord
} from "/client/skeleton/dictionary";


export function createEditor<I, P extends EditorProps<I>>(): [() => (props: P) => void, () => UseEditorPropsReturn<P>] {
  const useRawEditorProps = createGlobalState<Array<P & {id: string}>>([]);
  const useRawEditorOpen = createGlobalState(false);
  const useRawEditingId = createGlobalState("");
  const useEditor = function (): (props: P) => void {
    const [, setEditorProps] = useRawEditorProps();
    const [, setEditorOpen] = useRawEditorOpen();
    const [, setEditingId] = useRawEditingId();
    const addEditor = useCallback(function (props: P): void {
      const id = nanoid();
      const onEditConfirm = async function (item: I, event: MouseEvent<HTMLButtonElement>): Promise<void> {
        await props.onEditConfirm?.(item, event);
        setEditorProps((previousProps) => {
          const nextProps = previousProps.filter((previousProp) => previousProp.id !== id);
          if (nextProps.length <= 0) {
            setEditorOpen(false);
          }
          return nextProps;
        });
      };
      const onDiscardConfirm = async function (event: MouseEvent<HTMLButtonElement>): Promise<void> {
        await props.onDiscardConfirm?.(event);
        setEditorProps((previousProps) => {
          const nextProps = previousProps.filter((previousProp) => previousProp.id !== id);
          if (nextProps.length <= 0) {
            setEditorOpen(false);
          }
          return nextProps;
        });
      };
      const onCancel = async function (event: MouseEvent<HTMLButtonElement>): Promise<void> {
        await props.onCancel?.(event);
        setEditorProps((previousProps) => {
          const nextProps = previousProps.filter((previousProp) => previousProp.id !== id);
          if (nextProps.length <= 0) {
            setEditorOpen(false);
          }
          return nextProps;
        });
      };
      setEditorProps((previousProps) => [...previousProps, {id, ...props, onEditConfirm, onDiscardConfirm, onCancel}]);
      setEditorOpen(true);
      setEditingId(id);
    }, [setEditorProps, setEditorOpen, setEditingId]);
    return addEditor;
  };
  const useEditorProps = function (): UseEditorPropsReturn<P> {
    const [editorProps] = useRawEditorProps();
    const [editorOpen, setEditorOpen] = useRawEditorOpen();
    const [editingId, setEditingId] = useRawEditingId();
    return {editorProps, editorOpen, setEditorOpen, editingId, setEditingId};
  };
  return [useEditor, useEditorProps];
}

export const [useWordEditor, useWordEditorProps] = createEditor<EditableWord, Parameters<typeof WordEditor>[0]>();
export const [useExampleEditor, useExampleEditorProps] = createEditor<EditableExample, Parameters<typeof ExampleEditor>[0]>();

type EditorProps<I> = {
  onEditConfirm?: (item: I, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<unknown>,
  onDiscardConfirm?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<unknown>,
  onCancel?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<unknown>
};
type UseEditorPropsReturn<P> = {
  editorProps: Array<P & {id: string}>,
  editorOpen: boolean,
  setEditorOpen: Dispatch<SetStateAction<boolean>>,
  editingId: string,
  setEditingId: Dispatch<SetStateAction<string>>
};