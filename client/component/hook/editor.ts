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
import type ExampleEditor from "/client/component/compound/example-editor";
import type WordEditor from "/client/component/compound/word-editor";
import {
  EditableExample,
  EditableWord
} from "/client/skeleton/dictionary";


export function createEditor<P extends WordEditorProps | ExampleEditorProps>(): [() => (props: P) => void, () => UseEditorPropsReturn<P>] {
  const useRawEditorProps = createGlobalState<Array<ExtendedEditorProps<P>>>([]);
  const useRawEditorOpen = createGlobalState(false);
  const useRawEditingId = createGlobalState("");
  const useEditor = function (): (props: P) => void {
    const [, setEditorProps] = useRawEditorProps();
    const [, setEditorOpen] = useRawEditorOpen();
    const [, setEditingId] = useRawEditingId();
    const addEditor = useCallback(function (props: P): void {
      const id = nanoid();
      const name = ("word" in props) ? props.word?.name : props.example?.sentence;
      const onTempSet = function (tempItem: any): void {
        const name = ("name" in tempItem) ? tempItem.name : tempItem.sentence;
        setEditorProps((editorProps) => editorProps.map((editorProp) => (editorProp.id === id) ? {...editorProp, name} : editorProp));
      };
      const onEditConfirm = async function (item: EditableWord & EditableExample, event: MouseEvent<HTMLButtonElement>): Promise<void> {
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
      setEditorProps((previousProps) => [...previousProps, {id, name, ...props, onTempSet, onEditConfirm, onDiscardConfirm, onCancel}]);
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

export const [useWordEditor, useWordEditorProps] = createEditor<WordEditorProps>();
export const [useExampleEditor, useExampleEditorProps] = createEditor<ExampleEditorProps>();

type ExtendedEditorProps<P> = P & {id: string, name?: string};
type WordEditorProps = Parameters<typeof WordEditor>[0];
type ExampleEditorProps = Parameters<typeof ExampleEditor>[0];

type UseEditorPropsReturn<P> = {
  editorProps: Array<ExtendedEditorProps<P>>,
  editorOpen: boolean,
  setEditorOpen: Dispatch<SetStateAction<boolean>>,
  editingId: string,
  setEditingId: Dispatch<SetStateAction<string>>
};