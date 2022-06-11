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


export function createEditor<I, P extends EditorProps<I>>(): [CreateEditorHook<P>, CreateEditorPropsHook<P>] {
  const useRawEditorProps = createGlobalState<Array<P & {id: string}>>([]);
  const useRawEditorOpen = createGlobalState(false);
  const useEditor = function (): (props: P) => void {
    const [, setEditorProps] = useRawEditorProps();
    const [, setEditorOpen] = useRawEditorOpen();
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
    }, [setEditorProps, setEditorOpen]);
    return addEditor;
  };
  const useEditorProps = function (): [Array<P & {id: string}>, boolean, Dispatch<SetStateAction<boolean>>] {
    const [editorProps] = useRawEditorProps();
    const [editorOpen, setEditorOpen] = useRawEditorOpen();
    return [editorProps, editorOpen, setEditorOpen];
  };
  return [useEditor, useEditorProps];
}

export const [useWordEditor, useWordEditorProps] = createEditor<EditableWord, Parameters<typeof WordEditor>[0]>();
export const [useExampleEditor, useExampleEditorProps] = createEditor<EditableExample, Parameters<typeof ExampleEditor>[0]>();

type EditorProps<I> = {
  onEditConfirm?: (item: I, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
  onDiscardConfirm?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
  onCancel?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
};
type CreateEditorHook<P> = () => (props: P) => void;
type CreateEditorPropsHook<P> = () => [Array<P & {id: string}>, boolean, Dispatch<SetStateAction<boolean>>];